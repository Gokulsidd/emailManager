'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';

function TreeNode({ node, level, onFolderSelect, selectedFolder }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.childFolder && node.childFolder.length > 0;
  const isSelected = selectedFolder?.path === node.path;
  const isSelectable = node.canUpload;

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleSelect = () => {
    if (isSelectable && onFolderSelect) {
      onFolderSelect(node);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-all ${
          isSelectable 
            ? isSelected
              ? 'bg-primary/10 border border-primary/30 shadow-sm'
              : 'hover:bg-muted cursor-pointer'
            : 'cursor-default opacity-50'
        }`}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        onClick={isSelectable ? handleSelect : undefined}
      >
        {hasChildren ? (
          <button
            className="p-0.5 hover:bg-accent rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}
        
        {isExpanded ? (
          <FolderOpen className="w-4 h-4 text-primary" />
        ) : (
          <Folder className="w-4 h-4 text-muted-foreground" />
        )}
        
        <span className={`text-sm ${isSelectable ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
          {node.folderName}
        </span>
        
        {node.canUpload && (
          <span className="ml-auto text-xs text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400 px-2 py-0.5 rounded-md font-medium">
            Selectable
          </span>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div>
          {node.childFolder.map((child, index) => (
            <TreeNode
              key={index}
              node={child}
              level={level + 1}
              onFolderSelect={onFolderSelect}
              selectedFolder={selectedFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FolderTree({ data, onFolderSelect, selectedFolder }) {
  return (
    <div className="border rounded-xl bg-card max-h-96 overflow-y-auto">
      {data.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No folders available
        </div>
      ) : (
        <div className="py-2">
          {data.map((node, index) => (
            <TreeNode
              key={index}
              node={node}
              level={0}
              onFolderSelect={onFolderSelect}
              selectedFolder={selectedFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}