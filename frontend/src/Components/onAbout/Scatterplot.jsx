import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ScatterPlot = ({ data }) => {
  return (
    <div className="min-w-[60%] h-[340px] p-10 bg-gray-300">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="X Axis" />
          <YAxis type="number" dataKey="y" name="Y Axis" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Sample Data" data={data} fill="#82ca9d" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;
