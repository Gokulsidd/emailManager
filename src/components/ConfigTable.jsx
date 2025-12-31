"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Plus, Search } from "lucide-react";
import ConfigWizard from "./ConfigWizard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function ConfigTable({ configs: initialConfigs }) {
  const [configs, setConfigs] = useState(initialConfigs);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState(null);

  const {
    isWizardOpen,
    openWizard,
  } = useStore();

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredConfigs = configs.filter((config) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      config.profileName.toLowerCase().includes(searchLower) ||
      config.userName.toLowerCase().includes(searchLower) ||
      config.mailFolder.toLowerCase().includes(searchLower)
    );
  });

  const sortedConfigs = [...filteredConfigs].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn].toLowerCase();
    const bValue = b[sortColumn].toLowerCase();

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleEdit = (id) => {
    const config = configs.find((c) => c.id.toString() === id);
    if (config) {
      openWizard("edit", config);
    }
  };

  const handleDelete = (id) => {
    const config = configs.find((c) => c.id.toString() === id);
    if (config) {
      setConfigToDelete(config);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (configToDelete) {
      setConfigs(
        configs.filter((c) => c.id.toString() !== configToDelete.id.toString())
      );
      setDeleteDialogOpen(false);
      setConfigToDelete(null);
    }
  };

  const handleAddNew = () => {
    setSelectedConfig(undefined);
    setWizardMode("add");
    setIsWizardOpen(true);
  };

  const handleSaveConfig = (configData) => {
    if (wizardMode === "add") {
      const newConfig = {
        id: Date.now().toString(),
        profileName: configData.profileName,
        userName: configData.userName,
        mailFolder: configData.mailFolder,
        emailsPerSession: 100,
        rules: configData.rules,
        mailAction: configData.mailAction,
        saveConversation: configData.saveConversation,
        saveAttachmentSeparate: configData.saveAttachmentSeparate,
      };
      setConfigs([...configs, newConfig]);
    } else {
      if (selectedConfig) {
        const updatedConfigs = configs.map((c) =>
          c.id.toString() === selectedConfig.id.toString()
            ? {
                ...c,
                profileName: configData.profileName,
                userName: configData.userName,
                mailFolder: configData.mailFolder,
                rules: configData.rules,
                mailAction: configData.mailAction,
                saveConversation: configData.saveConversation,
                saveAttachmentSeparate: configData.saveAttachmentSeparate,
              }
            : c
        );
        setConfigs(updatedConfigs);
      }
    }
    setIsWizardOpen(false);
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
    setSelectedConfig(undefined);
  };

  return (
    <>
      <div className="flex gap-0 h-full overflow-hidden px-2">
        <div
          className={`flex flex-col transition-all duration-300 w-full`}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 bg-background s">
            <h1 className="text-xl font-semibold text-foreground">
              Email Rules
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rules..."
                  className="pl-9 w-64 h-9 bg-background"
                />
              </div>
              {/* <Button onClick={handleAddNew} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                New Rule
              </Button> */}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto px-4 py-2">
            <div className="rounded-xl border bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b">
                    <TableHead className="w-30 pl-4">Actions</TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("profileName")}
                    >
                      <div className="flex items-center gap-2">
                        Profile Name
                        {sortColumn === "profileName" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("userName")}
                    >
                      <div className="flex items-center gap-2">
                        Email Address
                        {sortColumn === "userName" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("mailFolder")}
                    >
                      <div className="flex items-center gap-2">
                        Mail Folder
                        {sortColumn === "mailFolder" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedConfigs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-12 text-muted-foreground"
                      >
                        No rules found. Create your first rule to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedConfigs.map((config) => (
                      <TableRow key={config.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(config.id)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(config.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-regular">
                          {config.profileName}
                        </TableCell>
                        <TableCell className="text-primary">
                          {config.userName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {config.mailFolder}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* {isWizardOpen && (
          <div className="w-1/3 h-full py-2 pl-0 pr-2">
            <div className="w-full h-full overflow-hidden border-l shadow-md rounded-xl">
              <ConfigWizard
                isOpen={isWizardOpen}
                onClose={handleCloseWizard}
                config={selectedConfig}
                mode={wizardMode}
                onSave={handleSaveConfig}
              />
            </div>
          </div>
        )} */}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {configToDelete?.profileName}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
