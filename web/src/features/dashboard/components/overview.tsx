import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

type CategoryData = {
  category: string
  count: number
  totalValue: number
}

type OverviewProps = {
  data: CategoryData[]
}

export function Overview({ data }: OverviewProps) {
  // Transformed chart data
  const chartData = data.map((item) => ({
    name: item.category,
    products: item.count,
    value: item.totalValue,
  }))

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className='bg-background border-border rounded-lg border p-2 shadow-sm'>
                  <div className='grid grid-cols-2 gap-2'>
                    <div className='flex flex-col'>
                      <span className='text-muted-foreground text-[0.70rem] uppercase'>
                        Products
                      </span>
                      <span className='text-muted-foreground font-bold'>
                        {payload[0].value}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-muted-foreground text-[0.70rem] uppercase'>
                        Value
                      </span>
                      <span className='font-bold'>
                        $
                        {Number(payload[0].payload.value).toLocaleString(
                          'en-US',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar
          dataKey='products'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
