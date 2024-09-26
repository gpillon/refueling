import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getVehicles, getRefuelings } from '../services/api';
import { Vehicle, Refueling } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, YAxisProps } from 'recharts';

const getOneMonthAgo = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const CustomYAxis: React.FC<YAxisProps> = (props) => {
  return (
    <YAxis
      allowDecimals={false}
      domain={['auto', 'auto']}
      tickFormatter={(value) => `${value}€`}
      {...props}
    />
  );
};

const Statistics: React.FC = () => {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [refuelings, setRefuelings] = useState<Refueling[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(getOneMonthAgo());
  const [endDate, setEndDate] = useState<string>(getCurrentDate());
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | ''>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [vehiclesData, refuelingsData] = await Promise.all([
        getVehicles(),
        getRefuelings(new URLSearchParams({ startDate, endDate, ...(selectedVehicleId && { vehicleId: selectedVehicleId.toString() }) })),
      ]);
      setVehicles(vehiclesData);
      setRefuelings(refuelingsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchData();
  };

  const getTotalRefuelings = () => refuelings.length;
  const getTotalLiters = () => refuelings.reduce((sum, refueling) => sum + refueling.liters, 0);
  const getTotalCost = () => refuelings.reduce((sum, refueling) => sum + refueling.cost, 0);
  const getAverageCostPerLiter = () => getTotalCost() / getTotalLiters();
  const getTotalKilometers = () => {
    if (refuelings.length < 2) return 0;
    const sortedRefuelings = [...refuelings].sort((a, b) => a.kilometers - b.kilometers);
    return sortedRefuelings[sortedRefuelings.length - 1].kilometers - sortedRefuelings[0].kilometers;
  };
  const getAverageKilometersPerRefueling = () => getTotalKilometers() / getTotalRefuelings();
  const getAverageCostPer100km = () => (getTotalCost() / getTotalKilometers()) * 100;
  const getAverageLitersPer100km = () => (getTotalLiters() / getTotalKilometers()) * 100;

  const getRefuelingsByVehicle = () => {
    const refuelingsByVehicle: { [key: number]: number } = {};
    refuelings.forEach((refueling) => {
      refuelingsByVehicle[refueling.vehicleId] = (refuelingsByVehicle[refueling.vehicleId] || 0) + 1;
    });
    return Object.entries(refuelingsByVehicle).map(([vehicleId, count]) => ({
      name: vehicles.find((v) => v.id === parseInt(vehicleId))?.plate || 'Unknown',
      value: count,
    }));
  };

  const getCostOverTime = () => {
    const sortedRefuelings = [...refuelings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sortedRefuelings.map((refueling) => ({
      date: new Date(refueling.date).toLocaleDateString(),
      cost: refueling.cost
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  if (error) {
    return <p className="text-red-500 text-center text-xl mt-8">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">{t('statistics')}</h1>

      {/* Add filters */}
      <div className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
            <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
              {t('startDate')}:
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
            <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">
                {t('endDate')} <a className="text-blue-500 hover:text-blue-700" href="#" onClick={(e) => { e.preventDefault(); setEndDate(getCurrentDate()); setStartDate(getOneMonthAgo()); fetchData(); }}>({t('lastMonth')})</a>:
            </label>
            <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            </div>
          <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
            <label htmlFor="vehicleId" className="block text-gray-700 text-sm font-bold mb-2">
              {t('vehicleOptional')}:
            </label>
            <select
              id="vehicleId"
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value === '' ? '' : parseInt(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">{t('allVehicles')}</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} - {vehicle.plate} ({vehicle.year})
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/4 px-2 flex items-end">
            <button
              onClick={handleApplyFilters}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              {t('applyFilters')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">{t('totalRefuelings')}</h2>
          <p className="text-3xl font-bold text-blue-600">{getTotalRefuelings()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">{t('totalLiters')}</h2>
          <p className="text-3xl font-bold text-green-600">{getTotalLiters().toFixed(2)} L</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">{t('totalCost')}</h2>
          <p className="text-3xl font-bold text-red-600">{getTotalCost().toFixed(2)} €</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">{t('averageCostPerLiter')}</h2>
          <p className="text-3xl font-bold text-purple-600">{getAverageCostPerLiter().toFixed(2)} €/L</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">{t('totalKilometers')}</h2>
          <p className="text-3xl font-bold text-indigo-600">{getTotalKilometers().toFixed(0)} km</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">{t('averageKilometersPerRefueling')}</h2>
          <p className="text-3xl font-bold text-yellow-600">{getAverageKilometersPerRefueling().toFixed(1)} km</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">{t('averageCostPer100km')}</h2>
          <p className="text-3xl font-bold text-pink-600">{getAverageCostPer100km().toFixed(2)} €</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">{t('averageLitersPer100km')}</h2>
          <p className="text-3xl font-bold text-teal-600">{getAverageLitersPer100km().toFixed(2)} L</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">{t('refuelingsByVehicle')}</h2>
          <div className="flex-grow" style={{ minHeight: "500px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getRefuelingsByVehicle()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  fill="#8884d8"
                  label
                >
                  {getRefuelingsByVehicle().map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">{t('costOverTime')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getCostOverTime()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <CustomYAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cost" name={t('cost')} stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
