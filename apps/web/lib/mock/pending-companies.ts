export interface PendingCompany {
  id: string;
  companyCode: string;
  name: string;
  nameEn?: string;
  industry: string;
  prefecture: string;
  businessRegNumber?: string;
  registrationNote?: string;
  email: string;
  registeredAt: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

export const MOCK_PENDING_COMPANIES: PendingCompany[] = [
  {
    id: '10',
    companyCode: 'C0000010',
    name: '株式会社テクノソリューション',
    nameEn: 'TechnoSolution Inc.',
    industry: 'IT・ソフトウェア',
    prefecture: '東京都',
    businessRegNumber: '1234567890123',
    registrationNote:
      'ITコンサルティング企業です。エンジニア採用を強化したく、JobMatchに登録申請しました。法人番号・会社概要は添付の通りです。',
    email: 'hr@technosolution.co.jp',
    registeredAt: '2026-04-02T08:30:00Z',
    status: 'PENDING_APPROVAL',
  },
  {
    id: '11',
    companyCode: 'C0000011',
    name: 'グローバル商事株式会社',
    nameEn: 'Global Trading Co., Ltd.',
    industry: '商社・貿易',
    prefecture: '大阪府',
    businessRegNumber: '9876543210001',
    registrationNote:
      '日本とウズベキスタン間の貿易事業を展開しています。多言語対応スタッフの採用を目的に登録します。',
    email: 'recruit@globaltrading.jp',
    registeredAt: '2026-04-02T11:15:00Z',
    status: 'PENDING_APPROVAL',
  },
  {
    id: '12',
    companyCode: 'C0000012',
    name: 'メディカルケア株式会社',
    nameEn: 'MedicalCare Corp.',
    industry: '医療・介護',
    prefecture: '神奈川県',
    businessRegNumber: '5555555555555',
    registrationNote: '介護施設を神奈川県内に5拠点運営しています。外国人採用にも積極的に取り組んでいます。',
    email: 'info@medicalcare.jp',
    registeredAt: '2026-04-03T03:00:00Z',
    status: 'PENDING_APPROVAL',
  },
];
