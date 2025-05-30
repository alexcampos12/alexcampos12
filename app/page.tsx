export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-orange-100">Dashboard Financeiro</h1>
          <p className="text-gray-600 dark:text-orange-400">Visão geral dos principais indicadores</p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-orange-400 mb-2">Receita Mensal</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-orange-100">R$ 150.000</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">+8.2% vs mês anterior</div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-orange-400 mb-2">Despesas Totais</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-orange-100">R$ 121.620</div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">+24.1% vs mês anterior</div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-orange-400 mb-2">Lucro Líquido</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-orange-100">R$ 28.380</div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">-39.6% vs mês anterior</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-orange-400 mb-2">Margem Líquida</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-orange-100">18.9%</div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">-15.2% vs mês anterior</div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-orange-400 mb-2">MRR</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-orange-100">R$ 50.000</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">+10.0% vs mês anterior</div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="text-sm font-medium text-gray-600 dark:text-orange-400 mb-2">ARR</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-orange-100">R$ 600.000</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">+10.0% vs mês anterior</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="text-lg font-semibold text-gray-900 dark:text-orange-100 mb-4">Resumo Financeiro</div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-orange-400">Receita Total</span>
                <span className="font-semibold text-gray-900 dark:text-orange-100">R$ 150.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-orange-400">Despesas Total</span>
                <span className="font-semibold text-gray-900 dark:text-orange-100">R$ 121.620</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm font-medium text-gray-700 dark:text-orange-300">Lucro Líquido</span>
                <span className="font-bold text-green-600 dark:text-green-400">R$ 28.380</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="text-lg font-semibold text-gray-900 dark:text-orange-100 mb-4">Status Geral</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-orange-400">Performance</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Boa</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-orange-400">Crescimento</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 dark:bg-orange-400 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-600 dark:text-orange-400">Estável</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-orange-400">Margem</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Atenção</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
