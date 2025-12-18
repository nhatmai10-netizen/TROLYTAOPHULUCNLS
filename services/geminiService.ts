import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, GeneratedDossier } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FRAMEWORK_CONTEXT = `
CƠ SỞ PHÁP LÝ: THÔNG TƯ 02/2025/TT-BGDĐT (KHUNG NĂNG LỰC SỐ CHO NGƯỜI HỌC)
Áp dụng cho cấp THCS với 2 mức độ trình độ:
- Khối 6, 7: Mức độ "Trung cấp 1" (Mã: TC1)
- Khối 8, 9: Mức độ "Trung cấp 2" (Mã: TC2)

HỆ THỐNG 06 MIỀN NĂNG LỰC VÀ 24 NĂNG LỰC THÀNH PHẦN (CHUẨN 2025):

1. Khai thác dữ liệu và thông tin
   1.1. Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số (1.1)
   1.2. Đánh giá dữ liệu, thông tin và nội dung số (1.2)
   1.3. Quản lý dữ liệu, thông tin và nội dung số (1.3)

2. Giao tiếp và hợp tác
   2.1. Tương tác thông qua công nghệ số (2.1)
   2.2. Chia sẻ thông tin và nội dung thông qua công nghệ số (2.2)
   2.3. Sử dụng công nghệ số để thực hiện trách nhiệm công dân (2.3)
   2.4. Hợp tác thông qua công nghệ số (2.4)
   2.5. Quy tắc ứng xử trên mạng (Netiquette) (2.5)
   2.6. Quản lý danh tính số (2.6)

3. Sáng tạo nội dung số
   3.1. Phát triển nội dung số (3.1)
   3.2. Tích hợp và tạo lập lại nội dung số (3.2)
   3.3. Thực thi bản quyền và giấy phép (3.3)
   3.4. Lập trình (3.4)

4. An toàn
   4.1. Bảo vệ thiết bị (4.1)
   4.2. Bảo vệ dữ liệu cá nhân và quyền riêng tư (4.2)
   4.3. Bảo vệ sức khỏe và an sinh số (4.3)
   4.4. Bảo vệ môi trường (4.4)

5. Giải quyết vấn đề
   5.1. Giải quyết các vấn đề kỹ thuật (5.1)
   5.2. Xác định nhu cầu và giải pháp công nghệ (5.2)
   5.3. Sử dụng sáng tạo công nghệ số (5.3)
   5.4. Xác định các vấn đề cần cải thiện về NLS (5.4)

6. Ứng dụng trí tuệ nhân tạo (AI) - *Mới*
   6.1. Hiểu biết về trí tuệ nhân tạo (6.1)
   6.2. Sử dụng trí tuệ nhân tạo (6.2)
   6.3. Đánh giá trí tuệ nhân tạo (6.3)

QUY TẮC MÃ HÓA CHỈ BÁO: [Mã NL].[Mức độ][Thứ tự hành vi a,b,c...]
Ví dụ:
- Lớp 6 (TC1): 1.1.TC1a (Giải thích được nhu cầu thông tin), 4.1.TC1a (Chỉ ra được cách bảo vệ thiết bị).
- Lớp 9 (TC2): 1.1.TC2a (Minh họa được nhu cầu thông tin), 6.1.TC2a (Phân tích cách AI hoạt động trong ứng dụng cụ thể).

ĐẶC ĐIỂM HÀNH VI (KEY VERBS):
- TC1 (Lớp 6-7): Giải thích, Thực hiện rõ ràng, Phân biệt, Lựa chọn xác định rõ, Chỉ ra được.
- TC2 (Lớp 8-9): Minh họa, Tổ chức, Mô tả, Phân tích, So sánh, Đánh giá, Áp dụng, Thảo luận.
`;

const SYSTEM_INSTRUCTION = `
Bạn là Hệ thống Trợ lý Hồ sơ Chuyên môn cấp cao cho giáo dục phổ thông Việt Nam, tuân thủ tuyệt đối Thông tư 02/2025/TT-BGDĐT.

NHIỆM VỤ:
Tạo dữ liệu JSON cho Phụ lục 1 (Bảng chỉ báo NLS) và Phụ lục 3 (Kế hoạch giáo dục - Mẫu 5512) dựa trên danh sách bài dạy.

QUY TẮC BẮT BUỘC:
1. CHÍNH XÁC TUYỆT ĐỐI VỀ MÃ:
   - Nếu Input là Lớp 6 hoặc 7: BẮT BUỘC dùng mã chứa "TC1" (Trung cấp 1).
   - Nếu Input là Lớp 8 hoặc 9: BẮT BUỘC dùng mã chứa "TC2" (Trung cấp 2).
   - Mã chỉ báo phải tồn tại trong khung năng lực (VD: 1.1.TC1a, 6.2.TC2b).

2. TÍCH HỢP TOÀN DIỆN (YÊU CẦU MỚI):
   - Phải tích hợp Năng lực số vào TẤT CẢ các bài học trong danh sách (100% bài học).
   - Nếu bài học khó tích hợp chuyên sâu, hãy chọn các chỉ báo nền tảng như: Tra cứu (1.1), An toàn (4.1), hoặc Ứng xử (2.5).

3. PHỤ LỤC 3 (MẪU 5512):
   - Cột "Số tiết": Trích xuất từ input hoặc ước lượng nếu không có.
   - Cột "Thời điểm thực hiện": Tính toán dựa trên số tiết/tuần (VD: Tuần 1, Tuần 2-3...).
   - Cột "Thiết bị dạy học": Phải ghi cụ thể dựa trên điều kiện CNTT (VD: Máy tính kết nối Internet, Phần mềm Geogebra, Tivi thông minh).
   - Cột "Ghi chú": Ghi rõ Mã chỉ báo và hoạt động ngắn (VD: "1.1.TC1a - Tìm kiếm tư liệu").

4. ĐỊNH DẠNG JSON:
   - Trả về JSON thuần túy, không có markdown formatting.

${FRAMEWORK_CONTEXT}
`;

export const generateDossier = async (input: UserInput): Promise<GeneratedDossier> => {
  try {
    const isLowerSecondary = ['Lớp 6', 'Lớp 7'].includes(input.grade);
    const requiredLevel = isLowerSecondary ? 'TC1' : 'TC2';
    
    const prompt = `
    DỮ LIỆU ĐẦU VÀO:
    - Môn: ${input.subject}
    - Khối: ${input.grade} (Yêu cầu mức độ: ${requiredLevel})
    - Bộ sách: ${input.textbook}
    - Điều kiện CNTT: ${input.itCondition}
    - Số tiết / Tuần: ${input.periodsPerWeek} tiết.
    - Danh sách bài dạy (có thể kèm số tiết từng bài):
    ${input.topicList}

    YÊU CẦU CỤ THỂ:
    1. Tạo Phụ lục 1: Tích hợp chỉ báo NLS cho TẤT CẢ các bài học. Sử dụng đúng mã ${requiredLevel}.
    2. Tạo Phụ lục 3: 
       - Trích xuất số tiết từng bài (nếu có trong input "Tên bài (x tiết)"), nếu không hãy ước lượng.
       - Tính toán cột "Thời điểm thực hiện" (Tuần) dựa trên tổng số tiết tích lũy và số tiết/tuần (${input.periodsPerWeek} tiết/tuần).
       - Điền đầy đủ cột "Thiết bị dạy học" và "Địa điểm dạy học".
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Nhận xét tổng quan về mức độ tích hợp NLS (ngắn gọn)." },
            appendix1: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stt: { type: Type.INTEGER },
                  subject: { type: Type.STRING },
                  grade: { type: Type.STRING },
                  lesson: { type: Type.STRING },
                  domain: { type: Type.STRING },
                  competency: { type: Type.STRING },
                  indicatorCode: { type: Type.STRING, description: `Mã phải chứa ${requiredLevel} (VD: 1.1.${requiredLevel}a)` },
                  level: { type: Type.STRING, description: requiredLevel },
                  suitability: { type: Type.STRING, description: "Mô tả hành vi học sinh (ngắn)" },
                  note: { type: Type.STRING }
                }
              }
            },
            appendix3: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stt: { type: Type.INTEGER },
                  lesson: { type: Type.STRING },
                  duration: { type: Type.INTEGER, description: "Số tiết của bài học này" },
                  timing: { type: Type.STRING, description: "Tuần thực hiện (VD: Tuần 1, Tuần 2-3)" },
                  equipment: { type: Type.STRING },
                  location: { type: Type.STRING, description: "Địa điểm tổ chức hoạt động dạy học" },
                  integrationNote: { type: Type.STRING, description: "Ghi chú tích hợp NLS (Mã + Hoạt động)" }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Không nhận được dữ liệu từ hệ thống.");
    
    return JSON.parse(resultText) as GeneratedDossier;

  } catch (error) {
    console.error("Lỗi khi tạo hồ sơ:", error);
    throw new Error("Hệ thống đang bận hoặc gặp lỗi xử lý. Vui lòng thử lại.");
  }
};