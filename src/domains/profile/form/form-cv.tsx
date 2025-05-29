import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProfileData } from "@/types/profile";
import { FileText, Download, Upload, Trash2, Loader2 } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import z from "zod";
import { cvFileSchema } from "../schema/schema";

export const CVUploadZone: React.FC<{
    onFileSelect: (file: File) => void;
    isUploading: boolean;
    currentCV?: ProfileData['cv'];
    onDelete?: () => void;
    onDownload?: () => void;
}> = ({ onFileSelect, isUploading, currentCV, onDelete, onDownload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateAndSelectFile = useCallback((file: File) => {
        setError(null);

        try {
            cvFileSchema.parse({ file });
            onFileSelect(file);
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message);
            }
        }
    }, [onFileSelect]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSelectFile(e.dataTransfer.files[0]);
        }
    }, [validateAndSelectFile]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSelectFile(e.target.files[0]);
        }
    }, [validateAndSelectFile]);

    const formatFileSize = useCallback((bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    if (currentCV) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium text-foreground">{currentCV.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {formatFileSize(currentCV.size)} • Uploadé le {new Date(currentCV.uploadDate).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onDownload}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Remplacer
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onDelete}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileInput}
                    className="hidden"
                />
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <Card
                className={`p-8 border-2 border-dashed transition-colors cursor-pointer ${dragActive
                    ? 'border-primary bg-primary/5'
                    : isUploading
                        ? 'border-muted bg-muted/20'
                        : 'border-muted hover:border-primary hover:bg-primary/5'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
            >
                <div className="text-center space-y-4">
                    {isUploading ? (
                        <>
                            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
                            <div>
                                <p className="text-lg font-medium text-foreground">Upload en cours...</p>
                                <p className="text-sm text-muted-foreground">Veuillez patienter</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                            <div>
                                <p className="text-lg font-medium text-foreground">
                                    Glissez-déposez votre CV ici
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    ou <span className="text-primary font-medium">cliquez pour parcourir</span>
                                </p>
                            </div>
                            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                                <span>PDF, DOCX acceptés</span>
                                <span>•</span>
                                <span>Maximum 5MB</span>
                            </div>
                        </>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isUploading}
                />
            </Card>

            {error && (
                <Alert title="Erreur" className="border-destructive bg-destructive/10">
                    {error}
                </Alert>
            )}
        </div>
    );
};
