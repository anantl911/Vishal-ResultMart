import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Histogram = ({ data }) => {
  return (
    <div className="min-w-[60%] h-[340px] p-10 bg-gray-300">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#0274b3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Histogram;