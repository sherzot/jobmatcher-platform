'use client';

import { useState } from 'react';

interface Education {
  id: string;
  schoolName: string;
  faculty: string;
  degree: string;
  startDate: string;
  endDate: string;
  isGraduated: boolean;
}

interface Experience {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

interface Skill { id: string; name: string; level: string; }
interface Qualification { id: string; name: string; issuedBy: string; issuedDate: string; }

const INITIAL_EDUCATIONS: Education[] = [
  { id: '1', schoolName: 'タシケント情報技術大学', faculty: '情報工学部', degree: '学士', startDate: '2015年09月', endDate: '2019年06月', isGraduated: true },
];

const INITIAL_EXPERIENCES: Experience[] = [
  { id: '1', companyName: 'ABC Tech株式会社', position: 'フロントエンドエンジニア', startDate: '2019年07月', endDate: '', isCurrent: true, description: 'ReactとTypeScriptを使ったWebアプリ開発。チームリードとして4名をマネジメント。' },
  { id: '2', companyName: 'XYZ Solutions', position: 'Webエンジニア', startDate: '2017年06月', endDate: '2019年06月', isCurrent: false, description: 'PHPとJavaScriptでECサイト開発。売上20%改善に貢献。' },
];

const INITIAL_SKILLS: Skill[] = [
  { id: '1', name: 'React', level: 'advanced' },
  { id: '2', name: 'TypeScript', level: 'advanced' },
  { id: '3', name: 'Node.js', level: 'intermediate' },
  { id: '4', name: 'Python', level: 'intermediate' },
  { id: '5', name: 'AWS', level: 'beginner' },
];

const INITIAL_QUALIFICATIONS: Qualification[] = [
  { id: '1', name: '日本語能力試験N2', issuedBy: '国際交流基金', issuedDate: '2021年07月' },
];

const SKILL_LEVELS = [
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'advanced', label: '上級' },
  { value: 'expert', label: 'エキスパート' },
];

export default function ResumePage() {
  const [educations, setEducations] = useState<Education[]>(INITIAL_EDUCATIONS);
  const [experiences, setExperiences] = useState<Experience[]>(INITIAL_EXPERIENCES);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [qualifications, setQualifications] = useState<Qualification[]>(INITIAL_QUALIFICATIONS);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addEducation = () => {
    if (educations.length >= 3) return;
    setEducations([...educations, { id: Date.now().toString(), schoolName: '', faculty: '', degree: '', startDate: '', endDate: '', isGraduated: true }]);
  };

  const removeEducation = (id: string) => setEducations(educations.filter(e => e.id !== id));
  const updateEducation = (id: string, field: string, value: string | boolean) =>
    setEducations(educations.map(e => e.id === id ? { ...e, [field]: value } : e));

  const addExperience = () => {
    if (experiences.length >= 10) return;
    setExperiences([...experiences, { id: Date.now().toString(), companyName: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '' }]);
  };

  const removeExperience = (id: string) => setExperiences(experiences.filter(e => e.id !== id));
  const updateExperience = (id: string, field: string, value: string | boolean) =>
    setExperiences(experiences.map(e => e.id === id ? { ...e, [field]: value } : e));

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setSkills([...skills, { id: Date.now().toString(), name: newSkill.trim(), level: 'intermediate' }]);
    setNewSkill('');
  };

  const removeSkill = (id: string) => setSkills(skills.filter(s => s.id !== id));

  const addQualification = () =>
    setQualifications([...qualifications, { id: Date.now().toString(), name: '', issuedBy: '', issuedDate: '' }]);
  const removeQualification = (id: string) => setQualifications(qualifications.filter(q => q.id !== id));
  const updateQualification = (id: string, field: string, value: string) =>
    setQualifications(qualifications.map(q => q.id === id ? { ...q, [field]: value } : q));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">履歴書・職務経歴書</h1>
          <p className="mt-0.5 text-sm text-gray-500">学歴・職歴・スキル・資格を入力してください</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              保存しました
            </div>
          )}
          <button className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDFダウンロード
          </button>
          <button onClick={handleSave} className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            保存する
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Education 学歴 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">学歴 <span className="text-xs text-gray-400">（最大3件）</span></h2>
            </div>
            <button
              onClick={addEducation}
              disabled={educations.length >= 3}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-indigo-300 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              + 追加
            </button>
          </div>
          <div className="space-y-4">
            {educations.map((edu, idx) => (
              <div key={edu.id} className="relative rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">学歴 {idx + 1}</span>
                  <button onClick={() => removeEducation(edu.id)} className="text-xs text-red-400 hover:text-red-600">削除</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs text-gray-500">学校名 *</label>
                    <input value={edu.schoolName} onChange={e => updateEducation(edu.id, 'schoolName', e.target.value)}
                      placeholder="〇〇大学"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">学部・学科</label>
                    <input value={edu.faculty} onChange={e => updateEducation(edu.id, 'faculty', e.target.value)}
                      placeholder="情報工学部"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">学位</label>
                    <input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="学士・修士"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">入学年月</label>
                    <input value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)}
                      placeholder="2015年04月"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">卒業年月</label>
                    <input value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)}
                      placeholder="2019年03月"
                      disabled={!edu.isGraduated}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none disabled:bg-gray-100" />
                  </div>
                </div>
                <label className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <input type="checkbox" checked={edu.isGraduated} onChange={e => updateEducation(edu.id, 'isGraduated', e.target.checked)}
                    className="h-3.5 w-3.5 rounded" />
                  卒業済み
                </label>
              </div>
            ))}
            {educations.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-400">学歴を追加してください</p>
            )}
          </div>
        </div>

        {/* Experience 経歴 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">職務経歴 <span className="text-xs text-gray-400">（最大10件）</span></h2>
            <button
              onClick={addExperience}
              disabled={experiences.length >= 10}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-indigo-300 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              + 追加
            </button>
          </div>
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div key={exp.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">経歴 {idx + 1}</span>
                  <button onClick={() => removeExperience(exp.id)} className="text-xs text-red-400 hover:text-red-600">削除</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">会社名 *</label>
                    <input value={exp.companyName} onChange={e => updateExperience(exp.id, 'companyName', e.target.value)}
                      placeholder="〇〇株式会社"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">役職・職種 *</label>
                    <input value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)}
                      placeholder="エンジニア・マネージャー"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">入社年月</label>
                    <input value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                      placeholder="2019年07月"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">退社年月</label>
                    <input value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                      placeholder="2022年03月"
                      disabled={exp.isCurrent}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none disabled:bg-gray-100" />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs text-gray-500">業務内容・実績</label>
                    <textarea value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                      rows={3} placeholder="担当業務・実績・使用技術など..."
                      className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
                  </div>
                </div>
                <label className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <input type="checkbox" checked={exp.isCurrent} onChange={e => updateExperience(exp.id, 'isCurrent', e.target.checked)}
                    className="h-3.5 w-3.5 rounded" />
                  現在在職中
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Skills スキル */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">スキル</h2>
          <div className="mb-3 flex gap-2">
            <input
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="スキル名を入力（例: React）"
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
            />
            <button onClick={addSkill} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              追加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 pl-3 pr-2 py-1">
                <span className="text-sm font-medium text-indigo-700">{skill.name}</span>
                <select value={skill.level} onChange={e => setSkills(skills.map(s => s.id === skill.id ? { ...s, level: e.target.value } : s))}
                  className="bg-transparent text-xs text-indigo-500 focus:outline-none">
                  {SKILL_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
                <button onClick={() => removeSkill(skill.id)} className="ml-1 text-indigo-300 hover:text-indigo-600">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Qualifications 資格 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">資格・免許</h2>
            <button onClick={addQualification}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-indigo-300 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50">
              + 追加
            </button>
          </div>
          <div className="space-y-3">
            {qualifications.map((qual) => (
              <div key={qual.id} className="grid grid-cols-3 gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">資格名 *</label>
                  <input value={qual.name} onChange={e => updateQualification(qual.id, 'name', e.target.value)}
                    placeholder="日本語能力試験N2"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">発行機関</label>
                  <input value={qual.issuedBy} onChange={e => updateQualification(qual.id, 'issuedBy', e.target.value)}
                    placeholder="国際交流基金"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-gray-500">取得年月</label>
                    <input value={qual.issuedDate} onChange={e => updateQualification(qual.id, 'issuedDate', e.target.value)}
                      placeholder="2021年07月"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
                  </div>
                  <button onClick={() => removeQualification(qual.id)} className="mb-1 text-red-400 hover:text-red-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            {qualifications.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-400">資格を追加してください</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
