import bcrypt from 'bcryptjs';
import { CookieOptions, Request, Response } from 'express';
import { UserService } from '@/services/user.service';
import { AuthService } from '@/services/auth.service';
import { EmailService } from '@/services/email.service';
import { UserDto } from '@/dtos/user.dto';
import { appConfig } from '@/config/app';
import { emailConfig } from '@/config/email';
import { Responder } from '@/core/utils/responder';
import { HttpStatus } from '@/core/enums/http-status.enum';
import { RabbitMQProvider } from '@/providers/rabbitmq.provider';
import { EmailTemplate } from '@/core/enums/email-template.enum';
import { ResponseStatus } from '@/core/enums/response-status.enum';
import { AuthTokenService } from '@/services/access-token.service';
import { AuthTokenType } from '@/core/enums/auth-token-type.enum';
import { EmailOptions } from '@/core/interfaces/email-options.interface';
import { VerificationTokenService } from '@/services/verification-token.service';
import { DocusignIntegrationService } from '@/services/docusign-integration.service';
import { AuthenticationError, BadRequestError, UnprocessableEntityError } from '@/core/exceptions';

export class AuthController {
  constructor(
    private userService: UserService = new UserService(),
    private authService: AuthService = new AuthService(),
    private authTokenService: AuthTokenService = new AuthTokenService(),
    private emailService: EmailService = new EmailService(),
    private verificationTokenService: VerificationTokenService = new VerificationTokenService(),
    private readonly docusignIntegrationService: DocusignIntegrationService = new DocusignIntegrationService()
  ) {}

  register = async (req: Request, res: Response): Promise<Response> => {
    const registerDto = UserDto.toInstance(req.body);
    const validationErrors: Record<string, string> = {};

    const { failed, errors } = await registerDto.validate();

    if (failed) {
      Object.assign(validationErrors, errors);
    }

    if (registerDto.password !== registerDto.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length > 0) {
      throw new UnprocessableEntityError(
        AuthController.name,
        'Registration data is not valid',
        validationErrors
      );
    }

    const user = await this.userService.createUser(registerDto);
    const verificationToken = await this.verificationTokenService.createEmailVerificationToken(
      user.id
    );
    const verificationLink = `${appConfig.API_URL}/v1/auth/account-verify?token=${verificationToken.token}&userId=${user.id}`;

    const emailData: EmailOptions = {
      to: user.email,
      from: emailConfig.EMAIL_FROM,
      subject: 'Welcome! Please verify your email',
      template: EmailTemplate.ACCOUNT_VERIFICATION,
      context: { link: verificationLink },
    };

    await RabbitMQProvider.produce('email', emailData);

    // await this.emailService.sendEmail(email);

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.CREATED)
      .message('User registered successfully. Please verify your email.')
      .notify()
      .send();
  };

  accountVerify = async (req: Request, res: Response): Promise<void> => {
    const { token, userId } = req.query;

    if (!token || !userId) {
      throw new BadRequestError(AuthController.name, 'Token and User ID are required.');
    }

    const verificationToken = await this.verificationTokenService.findEmailVerificationToken(
      token as string,
      userId as string
    );

    if (!verificationToken) {
      throw new BadRequestError(AuthController.name, 'Verification token is not valid');
    }

    const user = await this.userService.findUserById(verificationToken.userId);

    if (!user) {
      throw new BadRequestError(AuthController.name, 'User not found');
    }

    await this.userService.markEmailAsVerified(verificationToken.userId);
    await this.verificationTokenService.revokeEmailVerificationToken(user.id);

    const emailData: EmailOptions = {
      to: user.email,
      from: emailConfig.EMAIL_FROM,
      subject: 'Account Verified! Welcome to Our Platform.',
      template: EmailTemplate.WELCOME,
      context: { link: appConfig.WEB_URL },
    };

    await RabbitMQProvider.produce('email', emailData);

    // await this.emailService.sendEmail(email);

    return res.redirect(`${appConfig.WEB_URL}/account-verified`);
  };

  authToken = async (req: Request, res: Response): Promise<Response> => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      throw new BadRequestError(AuthController.name, 'Email and Password are required.');
    }

    const data = await this.authService.authToken(identifier, password);

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    };

    res.cookie('accessToken', data.tokens.accessToken, {
      ...cookieOptions,
      maxAge: appConfig.ACCESS_TOKEN_EXPIRY,
    });

    res.cookie('refreshToken', data.tokens.refreshToken, {
      ...cookieOptions,
      maxAge: appConfig.REFRESH_TOKEN_EXPIRY,
    });

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Authenticated successfully')
      .data(data)
      .notify()
      .send();
  };

  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const token = req.body?.token ?? req.refreshToken;

    if (!token) {
      throw new BadRequestError(AuthController.name, 'Refresh token is required.');
    }

    const data = await this.authService.refreshToken(token);

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    };

    res.cookie('accessToken', data.accessToken, {
      ...cookieOptions,
      maxAge: appConfig.ACCESS_TOKEN_EXPIRY,
    });

    res.cookie('refreshToken', data.refreshToken, {
      ...cookieOptions,
      maxAge: appConfig.REFRESH_TOKEN_EXPIRY,
    });

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Token refreshed successfully')
      .data(data)
      .notify()
      .send();
  };

  forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError(AuthController.name, 'Email is required.');
    }

    const user = await this.userService.findUserByEmailOrUsername(email);
    await this.verificationTokenService.revokePasswordResetToken(user.id);

    const verificationToken = await this.verificationTokenService.createPasswordResetToken(user.id);
    const verificationLink = `${appConfig.WEB_URL}/reset-password?token=${verificationToken.token}&userId=${user.id}`;

    const emailData: EmailOptions = {
      to: user.email,
      from: emailConfig.EMAIL_FROM,
      subject: 'Password Reset Link',
      template: EmailTemplate.PASSWORD_RESET,
      context: { link: verificationLink },
    };

    await RabbitMQProvider.produce('email', emailData);

    // await this.emailService.sendEmail(emailData);

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Password reset email sent successfully')
      .notify()
      .send();
  };

  resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { token, userId, password, confirmPassword } = req.body;

    if (!token || !userId) {
      throw new BadRequestError(AuthController.name, 'Something went wrong, please try again.');
    }

    if (!password || !confirmPassword || password !== confirmPassword) {
      throw new BadRequestError(
        AuthController.name,
        'Password and confirmation password are required. Please provide both and try again.'
      );
    }

    const verificationToken = await this.verificationTokenService.findPasswordResetToken(
      token,
      userId
    );

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.updateUser(verificationToken.userId, { password: hashedPassword });

    await this.verificationTokenService.revokePasswordResetToken(userId);

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Password updated successfully')
      .notify()
      .send();
  };

  me = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { password, ...user } = await this.userService.findUserById(req.user.id);
      const docusign = await this.docusignIntegrationService.getByUserId(user.id);

      const data: any = {
        ...user,
        docusign: {
          status: !!docusign,
          ...(docusign ? { createdAt: docusign.createdAt, updatedAt: docusign.updatedAt } : {}),
        },
      };

      return new Responder(res)
        .status(ResponseStatus.SUCCESS)
        .code(HttpStatus.OK)
        .message('User details fetched successfully.')
        .data(data)
        .send();
    } catch (error) {
      throw new AuthenticationError(AuthController.name, 'User not authenticated.');
    }
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    await this.authTokenService.revokeToken(req.accessToken, AuthTokenType.ACCESS);

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Logged out successfully. Token removed.')
      .notify()
      .send();
  };

  updateProfile = async (req: Request, res: Response): Promise<Response> => {
    const registerDto = UserDto.toInstance(req.body);
    const validationErrors: Record<string, string> = {};

    const { failed, errors } = await registerDto.validate();

    if (failed) {
      Object.assign(validationErrors, errors);
    }

    if (registerDto.password && registerDto.password !== registerDto.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length > 0) {
      throw new UnprocessableEntityError(
        AuthController.name,
        'Profile data is not valid',
        validationErrors
      );
    }

    if (registerDto.password) {
      registerDto.password = await bcrypt.hash(registerDto.password, 10);
    }

    const user = await this.userService.updateUser(req.user.id, registerDto);

    return new Responder(res)
      .status(ResponseStatus.SUCCESS)
      .code(HttpStatus.OK)
      .message('Profile updated successfully.')
      .data(user)
      .notify()
      .send();
  };
}
