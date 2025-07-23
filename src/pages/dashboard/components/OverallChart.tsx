import { AreaChart, ResponsiveContainer, XAxis, YAxis, Area } from "recharts"

function defaultData() {
  const today = new Date()
  const dates = [
    new Date(today.getFullYear(), today.getMonth() - 0, 1),
    new Date(today.getFullYear(), today.getMonth() - 1, 1),
    new Date(today.getFullYear(), today.getMonth() - 2, 1),
  ]
  const getFormattedDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
      .format(date)
      .replace(",", "")
  return [
    {
      name: getFormattedDate(dates[0]),
      value: 5,
    },
    {
      name: getFormattedDate(dates[1]),
      value: 10,
    },
    {
      name: getFormattedDate(dates[2]),
      value: 0,
    },
  ]
}

export default function OverallChart() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-1 border border-neutral-200 rounded-3xl p-6">
      <ResponsiveContainer width="100%" height={192}>
        <AreaChart width={500} height={300} data={defaultData()}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="25%" stopColor="#F8DD9C" stopOpacity={1} />
              <stop offset="85%" stopColor="#F8DD9C20" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value} k`}
            min={50}
          />
          <Area
            type="monotone"
            strokeWidth={2}
            dataKey="value"
            stroke="#FFC300"
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
