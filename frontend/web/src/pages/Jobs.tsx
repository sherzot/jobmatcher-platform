import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Card } from "../app/ui";

export default function Jobs() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container className="py-6 sm:py-8 md:py-10 lg:py-12">
        <Card title="求人検索" subtitle="（完全な機能は近日中に提供予定）">
          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              検索、フィルタリング、並べ替えの UI はここにあります。
            </p>

            {/* Responsive Search Form Placeholder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  職種
                </label>
                <input
                  type="text"
                  placeholder="例：エンジニア"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  場所
                </label>
                <input
                  type="text"
                  placeholder="例：東京"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-slate-700">
                  給与
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>選択してください</option>
                  <option>300万円〜</option>
                  <option>400万円〜</option>
                  <option>500万円〜</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                検索する
              </button>
              <button className="w-full sm:w-auto px-6 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors text-sm font-medium">
                リセット
              </button>
            </div>
          </div>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}
