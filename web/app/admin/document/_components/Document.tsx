'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { documentInit } from '@/app/admin/document/_store/slice';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Info, Eye, Edit, Trash, Send, MoreHorizontal, MoreVertical } from 'lucide-react';
import EmptyState from '@/components/shared/empty-state';
import { SkeletonContent } from '@/components/skeleton';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/shared/dialog';
import { Modal } from '@/components/shared/modal';
import { DocumentAdd } from '@/app/admin/document/_components/DocumentAdd';
import { DocumentEdit } from '@/app/admin/document/_components/DocumentEdit';
import { DocumentDetail } from '@/app/admin/document/_components/DocumentDetail';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Document() {
  const dispatch = useAppDispatch();

  const { data, loading, requestId, action } = useAppSelector((state: any): any => state?.document);
  const docusignStatus = useAppSelector((state: any) => !!state.me.data?.docusign?.status);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);

  const handleAddDocument = async (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data?.file) {
      formData.append('file', data.file);
    }
    data.signers.forEach((signer: any, index: any) => {
      formData.append(`signers[${index}].name`, signer.name);
      formData.append(`signers[${index}].email`, signer.email);
      formData.append(`signers[${index}].designation`, signer.designation);
      formData.append(`signers[${index}].order`, signer.order);
    });

    dispatch(
      documentInit({
        type: 'save',
        payload: formData,
      })
    );
  };

  const handleEditDocument = async (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data?.file) {
      formData.append('file', data.file);
    }
    data.signers.forEach((signer: any, index: any) => {
      formData.append(`signers[${index}].name`, signer.name);
      formData.append(`signers[${index}].email`, signer.email);
      formData.append(`signers[${index}].designation`, signer.designation);
      formData.append(`signers[${index}].order`, signer.order);
    });

    dispatch(
      documentInit({
        type: 'update',
        payload: {
          id: data.id,
          formData,
        },
      })
    );
  };

  const fetchDocuments = (options: any = {}) => {
    dispatch(
      documentInit({
        type: 'get',
        payload: options,
      })
    );
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (requestId && ['save', 'update', 'delete', 'send'].includes(action)) {
      fetchDocuments();
      setShowAddModal(false);
      setShowEditModal(false);
      setShowDeleteDialog(false);
      setShowSendDialog(false);
    }
  }, [requestId, action]);

  useEffect(() => {
    const option = {
      ...(search ? { search } : {}),
      ...(status && status !== 'all' ? { status } : {}),
    };
    fetchDocuments(option);
  }, [search, status]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col gap-6">
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm grid grid-cols-2 gap-4 items-center">
        <div className="flex gap-4 items-center w-full">
          <Input
            type="text"
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-4/5"
          />
          <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="w-1/2">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="viewed">Viewed</SelectItem>
              <SelectItem value="signed">Signed</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="voided">Voided</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end items-center">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-black px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Create Document
          </Button>
        </div>
      </div>
      {loading ? (
        <SkeletonContent rows={6} />
      ) : data?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          <div className="hidden md:grid grid-cols-[30%,20%,10%,10%,10%,15%,5%] items-center font-semibold bg-gray-100 p-2 rounded-md">
            <div>Title</div>
            <div>Envelope ID</div>
            <div>Status</div>
            <div className="text-center">Signers</div>
            <div className="text-center">Date</div>
            <div className="text-right">Action</div>
          </div>

          {data.map((doc: any) => (
            <Card
              key={doc.id}
              className="grid grid-cols-1 md:grid-cols-[30%,20%,10%,10%,10%,15%,5%] items-center p-4 rounded-lg shadow-sm hover:shadow-lg transition-all"
            >
              <div className="truncate font-semibold text-gray-900">{doc.title}</div>
              <div className="hidden md:block truncate text-gray-500">
                {doc?.metadata?.envelopeId ?? 'N/A'}
              </div>
              <div className="hidden md:block text-sm font-medium px-2 py-1 rounded text-center w-max">
                {doc?.metadata?.status?.replace(/\b\w/g, (char: any) => char.toUpperCase()) ??
                  'Draft'}
              </div>
              <div className="text-center text-gray-600">{doc.signers.length}</div>
              <div className="hidden md:block text-center text-gray-500 text-sm">
                {doc.createdAt}
              </div>
              <div className="flex justify-end mt-4 md:mt-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-indigo-600 bg-gray-100 hover:bg-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {docusignStatus && (
                      <DropdownMenuItem
                        onClick={() => {
                          setShowSendDialog(true);
                          setSelectedDocument(doc);
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="h-5 w-5 text-gray-600" />
                        <span>Send</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        setShowDetailModal(true);
                        setSelectedDocument(doc);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Eye className="h-5 w-5 text-gray-600" />
                      <span>View</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setShowEditModal(true);
                        setSelectedDocument(doc);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Edit className="h-5 w-5 text-gray-600" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setShowDeleteDialog(true);
                        setSelectedDocument(doc);
                      }}
                      className="flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash className="h-5 w-5 text-red-600" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No Items" description="Add new items to see them here." icon={Info} />
      )}

      {showAddModal && (
        <>
          <Modal
            title="Add Document"
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            size="lg"
          >
            <DocumentAdd onClose={() => setShowAddModal(false)} onSubmit={handleAddDocument} />
          </Modal>
        </>
      )}
      {showEditModal && (
        <>
          <Modal
            title="Edit Document"
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            size="lg"
          >
            <DocumentEdit
              data={selectedDocument}
              onClose={() => setShowEditModal(false)}
              onSubmit={handleEditDocument}
            />
          </Modal>
        </>
      )}
      {showDetailModal && (
        <>
          <Modal
            title="Document Detail"
            isOpen={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            size="lg"
          >
            <DocumentDetail data={selectedDocument} />
          </Modal>
        </>
      )}
      {showSendDialog && (
        <>
          <Dialog
            title="Confirm Send"
            description="Are you sure you want to send this document to DocuSign?"
            isOpen={showSendDialog}
            onConfirm={() => {
              dispatch(
                documentInit({
                  type: 'send',
                  payload: selectedDocument,
                })
              );

              setShowSendDialog(false);
            }}
            onCancel={() => setShowSendDialog(false)}
          />
        </>
      )}
      {showDeleteDialog && (
        <>
          <Dialog
            title="Confirm Delete"
            description="Are you sure you want to delete this document? This action cannot be undone."
            isOpen={showDeleteDialog}
            onConfirm={() => {
              dispatch(
                documentInit({
                  type: 'delete',
                  payload: selectedDocument,
                })
              );

              setShowDeleteDialog(false);
            }}
            onCancel={() => setShowDeleteDialog(false)}
          />
        </>
      )}
    </div>
  );
}
