import React, { useState } from 'react';
import { UserInput, ITCondition, GenerationState } from './types';
import { generateDossier } from './services/geminiService';
import InputSection from './components/InputSection';
import DossierViewer from './components/DossierViewer';
import { BookOpen, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState<UserInput>({
    grade: 'Lớp 6',
    subject: '',
    textbook: 'Cánh Diều',
    itCondition: ITCondition.AVERAGE,
    topicList: '',
    periodsPerWeek: 2
  });

  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    data: null
  });

  const handleGenerate = async () => {
    setState({ isLoading: true, error: null, data: null });
    try {
      const data = await generateDossier(input);
      setState({ isLoading: false, error: null, data });
    } catch (err: any) {
      setState({ 
        isLoading: false, 
        error: err.message || "Đã có lỗi xảy ra", 
        data: null 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - No print */}
      <header className="bg-primary text-white shadow-lg no-print">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wide">Hệ thống Trợ lý Hồ sơ Chuyên môn</h1>
              <p className="text-xs text-blue-200 opacity-90">Theo Thông tư 02/2025/TT-BGDĐT & Công văn 5512</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm bg-blue-900 px-3 py-1 rounded">
            <BookOpen className="w-4 h-4" />
            <span>Phiên bản: THCS 1.0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        
        {!state.data && (
          <div className="mb-8 text-center max-w-2xl mx-auto no-print">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tự động hóa hồ sơ Năng lực số</h2>
            <p className="text-gray-600">
              Hệ thống giúp giáo viên xây dựng Phụ lục 1 và Phụ lục 3 chuẩn pháp lý chỉ trong vài giây.
              Nhập danh sách bài học và điều kiện thực tế để bắt đầu.
            </p>
          </div>
        )}

        {/* Input Form */}
        <InputSection 
          input={input} 
          setInput={setInput} 
          onGenerate={handleGenerate} 
          isLoading={state.isLoading} 
        />

        {/* Error Message */}
        {state.error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm no-print" role="alert">
            <p className="font-bold">Lỗi xử lý:</p>
            <p>{state.error}</p>
          </div>
        )}

        {/* Results Viewer */}
        {state.data && (
          <DossierViewer data={state.data} />
        )}
      </main>

      {/* Footer - No print */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm no-print">
        <p>© 2025 Hệ thống Trợ lý Giáo dục Phổ thông.</p>
        <p className="mt-1">Tuân thủ tiêu chuẩn kỹ thuật dữ liệu ngành giáo dục.</p>
      </footer>
    </div>
  );
};

export default App;