import React, { useState } from 'react';
import { GeneratedDossier } from '../types';
import { Printer, Download } from 'lucide-react';

interface DossierViewerProps {
  data: GeneratedDossier;
}

const DossierViewer: React.FC<DossierViewerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'appendix1' | 'appendix3'>('appendix1');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 mt-8 overflow-hidden">
      {/* Header / Tabs - Hidden on Print */}
      <div className="bg-gray-100 border-b border-gray-300 p-4 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('appendix1')}
            className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
              activeTab === 'appendix1' 
                ? 'bg-primary text-white shadow' 
                : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
          >
            PHỤ LỤC 1 (Chỉ báo NLS)
          </button>
          <button
            onClick={() => setActiveTab('appendix3')}
            className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
              activeTab === 'appendix3' 
                ? 'bg-primary text-white shadow' 
                : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
          >
            PHỤ LỤC 3 (Kế hoạch GD)
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 italic hidden lg:block">"{data.summary}"</span>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1 bg-gray-800 text-white px-3 py-2 rounded text-sm hover:bg-black"
          >
            <Printer className="w-4 h-4" /> In hồ sơ
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 min-h-[600px] overflow-x-auto bg-white">
        
        {/* APPENDIX 1 VIEW */}
        <div className={activeTab === 'appendix1' ? 'block' : 'hidden print:hidden'}>
          <div className="font-times text-center mb-6">
            <h3 className="font-bold text-lg uppercase">Phụ lục 1</h3>
            <h2 className="font-bold text-xl uppercase mb-2">BẢNG MÃ CHỈ BÁO NĂNG LỰC SỐ</h2>
            <p className="italic text-sm">(Kèm theo Kế hoạch giáo dục của Tổ chuyên môn)</p>
          </div>

          <table className="w-full border-collapse border border-black text-sm font-times">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 w-10 text-center">STT</th>
                <th className="border border-black p-2 text-center">Môn học</th>
                <th className="border border-black p-2 w-16 text-center">Khối</th>
                <th className="border border-black p-2 w-1/4 text-center">Bài học / Chủ đề</th>
                <th className="border border-black p-2 text-center">Miền năng lực số</th>
                <th className="border border-black p-2 text-center">Năng lực thành phần</th>
                <th className="border border-black p-2 w-24 text-center">Mã chỉ báo</th>
                <th className="border border-black p-2 w-16 text-center">Mức độ</th>
                <th className="border border-black p-2 text-center">Mức phù hợp (Mô tả hành vi)</th>
                <th className="border border-black p-2 text-center">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {data.appendix1.map((row) => (
                <tr key={row.stt} className="align-top hover:bg-gray-50">
                  <td className="border border-black p-2 text-center">{row.stt}</td>
                  <td className="border border-black p-2 text-center">{row.subject}</td>
                  <td className="border border-black p-2 text-center">{row.grade}</td>
                  <td className="border border-black p-2 font-semibold">{row.lesson}</td>
                  <td className="border border-black p-2">{row.domain}</td>
                  <td className="border border-black p-2">{row.competency}</td>
                  <td className="border border-black p-2 text-center font-bold text-primary whitespace-nowrap">{row.indicatorCode}</td>
                  <td className="border border-black p-2 text-center">{row.level}</td>
                  <td className="border border-black p-2 text-justify">{row.suitability}</td>
                  <td className="border border-black p-2">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* APPENDIX 3 VIEW */}
        <div className={activeTab === 'appendix3' ? 'block' : 'hidden print:block page-break'}>
           <div className="font-times text-center mb-6">
            <h3 className="font-bold text-lg uppercase">Phụ lục III</h3>
            <h2 className="font-bold text-xl uppercase mb-2">KHUNG KẾ HOẠCH GIÁO DỤC CỦA GIÁO VIÊN</h2>
            <p className="italic text-sm">(Kèm theo Công văn số 5512/BGDĐT-GDTrH)</p>
          </div>

          <div className="mb-4 font-times">
             <h4 className="font-bold uppercase mb-2">I. Kế hoạch dạy học</h4>
             <h5 className="font-bold italic mb-2">1. Phân phối chương trình</h5>
          </div>

          <table className="w-full border-collapse border border-black text-sm font-times">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 w-10 text-center">STT</th>
                <th className="border border-black p-2 w-1/3 text-center">Bài học / Chủ đề</th>
                <th className="border border-black p-2 w-16 text-center">Số tiết</th>
                <th className="border border-black p-2 text-center">Thời điểm</th>
                <th className="border border-black p-2 text-center">Thiết bị dạy học</th>
                <th className="border border-black p-2 text-center">Địa điểm dạy học</th>
                <th className="border border-black p-2 text-center">Ghi chú<br/>(Tích hợp NLS)</th>
              </tr>
            </thead>
            <tbody>
              {data.appendix3.map((row) => (
                <tr key={row.stt} className="align-top hover:bg-gray-50">
                  <td className="border border-black p-2 text-center">{row.stt}</td>
                  <td className="border border-black p-2 font-semibold">{row.lesson}</td>
                  <td className="border border-black p-2 text-center">{row.duration}</td>
                  <td className="border border-black p-2 text-center">{row.timing}</td>
                  <td className="border border-black p-2">{row.equipment}</td>
                  <td className="border border-black p-2 text-center">{row.location}</td>
                  <td className="border border-black p-2">{row.integrationNote}</td>
                </tr>
              ))}
            </tbody>
          </table>

           <div className="mt-8 font-times">
             <h4 className="font-bold uppercase mb-2">II. Thiết bị dạy học</h4>
             <ul className="list-disc pl-6 space-y-1">
               {Array.from(new Set(data.appendix3.flatMap(row => row.equipment ? row.equipment.split(',').map(s => s.trim()) : []))).filter(e => e && e !== 'Không' && e !== 'Không có').map((eq, idx) => (
                 <li key={idx}>{eq}</li>
               ))}
             </ul>
          </div>
        </div>

      </div>
      
      <div className="bg-yellow-50 p-4 border-t border-yellow-200 text-xs text-yellow-800 no-print text-center">
        * Lưu ý: Văn bản này được tạo tự động dựa trên Thông tư 02/2025/TT-BGDĐT. Giáo viên cần rà soát lại để phù hợp với thực tế nhà trường trước khi ký duyệt.
      </div>
    </div>
  );
};

export default DossierViewer;