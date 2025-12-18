import React, { useRef, useState } from 'react';
import { UserInput, ITCondition } from '../types';
import { SUBJECTS, GRADES, TEXTBOOKS, IT_CONDITIONS, SAMPLE_TOPICS } from '../constants';
import { FileText, Wand2, Upload, Loader2 } from 'lucide-react';

interface InputSectionProps {
  input: UserInput;
  setInput: (input: UserInput) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ input, setInput, onGenerate, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const handleChange = (field: keyof UserInput, value: string | number) => {
    setInput({ ...input, [field]: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    const fileName = file.name.toLowerCase();

    try {
      if (fileName.endsWith('.docx')) {
        // Xử lý file Word
        const mammoth = await import('https://esm.sh/mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        handleChange('topicList', result.value.trim());
      } else if (fileName.endsWith('.pdf')) {
        // Xử lý file PDF
        const pdfjsLib = await import('https://esm.sh/pdfjs-dist@4.0.379');
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.mjs';
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        handleChange('topicList', fullText.trim());
      } else {
        // Xử lý file văn bản thô (txt, csv, md)
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            handleChange('topicList', content.trim());
          }
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Lỗi khi đọc tệp:", error);
      alert("Không thể đọc tệp này. Vui lòng kiểm tra định dạng hoặc thử copy-paste trực tiếp.");
    } finally {
      setIsReadingFile(false);
      e.target.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 no-print">
      <div className="flex items-center gap-2 mb-6 text-primary border-b pb-2">
        <FileText className="w-6 h-6" />
        <h2 className="text-xl font-bold uppercase">Thiết lập thông tin hồ sơ</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Khối lớp</label>
              <select
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                value={input.grade}
                onChange={(e) => handleChange('grade', e.target.value)}
              >
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số tiết / Tuần</label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                value={input.periodsPerWeek}
                onChange={(e) => handleChange('periodsPerWeek', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={input.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
            >
              <option value="">-- Chọn môn học --</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bộ sách giáo khoa</label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={input.textbook}
              onChange={(e) => handleChange('textbook', e.target.value)}
            >
              {TEXTBOOKS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Điều kiện CNTT nhà trường</label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={input.itCondition}
              onChange={(e) => handleChange('itCondition', e.target.value)}
            >
              {IT_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4 flex flex-col h-full">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh sách bài học (Nên ghi kèm số tiết)
            </label>
            <button 
              onClick={triggerFileSelect}
              disabled={isReadingFile}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                isReadingFile ? 'text-gray-400' : 'text-primary hover:text-blue-800'
              }`}
              title="Hỗ trợ .docx, .pdf, .txt, .csv"
            >
              {isReadingFile ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Upload className="w-3 h-3" />
              )}
              {isReadingFile ? 'Đang đọc tệp...' : 'Tải lên Word/PDF/Text'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".docx,.pdf,.txt,.csv,.md" 
              className="hidden" 
            />
          </div>
          <div className="relative flex-grow">
            <textarea
              className="w-full h-full p-3 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Ví dụ:
  Bài 1: Tên bài (2 tiết)
  Bài 2: Tên bài (3 tiết)
  ..."
              value={input.topicList}
              onChange={(e) => handleChange('topicList', e.target.value)}
            />
            {isReadingFile && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-sm font-medium text-primary">Đang trích xuất văn bản...</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
             <button 
                onClick={() => handleChange('topicList', SAMPLE_TOPICS)}
                className="text-blue-600 hover:underline"
             >
                Dùng dữ liệu mẫu
             </button>
             <span>{input.topicList.split('\n').filter(Boolean).length} mục</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onGenerate}
          disabled={isLoading || isReadingFile || !input.subject || !input.topicList}
          className={`flex items-center gap-2 px-6 py-3 rounded text-white font-bold shadow-md transition-all
            ${isLoading || isReadingFile || !input.subject || !input.topicList 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary hover:bg-blue-800'}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang xử lý hồ sơ...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              XUẤT HỒ SƠ PHÁP LÝ
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;