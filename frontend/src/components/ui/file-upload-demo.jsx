import * as React from "react";
import { FileUploadCard } from "./file-upload-card";

// A mock file object for demonstration
const createMockFile = (name, size, type) => {
  const blob = new Blob([""], { type });
  return new File([blob], name, { type });
};

// Initial files for the demo
const initialFiles = [
  {
    id: "cv-pdf",
    file: createMockFile("my-cv.pdf", 120 * 1024, "application/pdf"),
    progress: 0,
    status: "uploading",
  },
  {
    id: "cert-pdf",
    file: createMockFile("google-certificate.pdf", 94 * 1024, "application/pdf"),
    progress: 100,
    status: "completed",
  },
];

export default function FileUploadDemo() {
  const [files, setFiles] = React.useState(initialFiles);
  const [isVisible, setIsVisible] = React.useState(true);

  // Simulate upload progress for the "uploading" file
  React.useEffect(() => {
    const uploadingFile = files.find((f) => f.status === "uploading");
    if (!uploadingFile) return;

    const interval = setInterval(() => {
      setFiles((prevFiles) =>
        prevFiles.map((f) => {
          if (f.id === uploadingFile.id) {
            const newProgress = Math.min(f.progress + 10, 100);
            return {
              ...f,
              progress: newProgress,
              status: newProgress === 100 ? "completed" : "uploading",
            };
          }
          return f;
        })
      );
    }, 300); // Update progress every 300ms

    return () => clearInterval(interval);
  }, [files]);

  // Handler for adding new files
  const handleFilesChange = (newFiles) => {
    const newUploadedFiles = newFiles.map((file) => ({
      id: `${file.name}-${Date.now()}`,
      file,
      progress: 0,
      status: "uploading",
    }));
    setFiles((prev) => [...prev, ...newUploadedFiles]);
  };

  // Handler for removing a file
  const handleFileRemove = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };
  
  // Handler for closing the card
  const handleClose = () => {
    setIsVisible(false);
    // After animation, reset to show again for demo purposes
    setTimeout(() => {
        setIsVisible(true);
        setFiles(initialFiles);
    }, 500);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-4">
       {isVisible && (
         <FileUploadCard
           files={files}
           onFilesChange={handleFilesChange}
           onFileRemove={handleFileRemove}
           onClose={handleClose}
         />
       )}
    </div>
  );
}
