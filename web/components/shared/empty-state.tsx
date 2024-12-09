const EmptyState = ({ title = 'No Data Found', description, icon: Icon, action }: any) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 border border-gray-200 rounded-md">
      {Icon && (
        <div className="mb-4 text-gray-400">
          <Icon className="h-12 w-12" />
        </div>
      )}
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
