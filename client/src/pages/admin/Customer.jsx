import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  IndianRupee,
  ShoppingBag,
  Mail,
  Phone,
} from "lucide-react";

export default function Customers() {

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, search]);

  const fetchCustomers = async () => {
    try {

      setLoading(true);

      const res = await api.get("/admin/users");

      const list = res.data?.data || [];

      setCustomers(list);

      setFilteredCustomers(list);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  const filterCustomers = () => {

    let data = [...customers];

    if (search) {

      data = data.filter((customer) =>
        customer.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        customer.email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        customer.phone
          ?.includes(search)
      );

    }

    setFilteredCustomers(data);

  };

  const totalCustomers = customers.length;

  const totalOrders = useMemo(() => {

    return customers.reduce(
      (sum, customer) =>
        sum + Number(customer.totalOrders || 0),
      0
    );

  }, [customers]);

  const totalRevenue = useMemo(() => {

    return customers.reduce(
      (sum, customer) =>
        sum + Number(customer.totalSpent || 0),
      0
    );

  }, [customers]);

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">

            Customers

          </h1>

          <p className="text-slate-500">

            Manage your customers

          </p>

        </div>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-5">

        <motion.div
          whileHover={{ y:-4 }}
          className="bg-white rounded-2xl border shadow-sm p-6"
        >

          <Users className="text-blue-600"/>

          <h2 className="text-3xl font-bold mt-3">

            {totalCustomers}

          </h2>

          <p className="text-slate-500">

            Total Customers

          </p>

        </motion.div>

        <motion.div
          whileHover={{ y:-4 }}
          className="bg-white rounded-2xl border shadow-sm p-6"
        >

          <ShoppingBag className="text-emerald-600"/>

          <h2 className="text-3xl font-bold mt-3">

            {totalOrders}

          </h2>

          <p className="text-slate-500">

            Orders

          </p>

        </motion.div>

        <motion.div
          whileHover={{ y:-4 }}
          className="bg-white rounded-2xl border shadow-sm p-6"
        >

          <IndianRupee className="text-orange-600"/>

          <h2 className="text-3xl font-bold mt-3">

            ₹{totalRevenue.toLocaleString()}

          </h2>

          <p className="text-slate-500">

            Revenue

          </p>

        </motion.div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl border shadow-sm p-5">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-4 text-slate-400"
          />

          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search customer..."
            className="w-full pl-11 py-3 border rounded-xl outline-none focus:border-emerald-500"
          />

        </div>

      </div>
            {/* Customers Table */}

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                  Contact
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                  Orders
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                  Total Spent
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                  Address
                </th>

                <th className="px-6 py-4 text-right text-xs uppercase text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                [...Array(8)].map((_, index) => (

                  <tr key={index}>

                    <td colSpan={6} className="p-5">

                      <div className="h-16 rounded-xl bg-slate-100 animate-pulse"></div>

                    </td>

                  </tr>

                ))

              ) : filteredCustomers.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="py-20 text-center text-slate-500"
                  >

                    No Customers Found

                  </td>

                </tr>

              ) : (

                filteredCustomers.map((customer) => (

                  <motion.tr
                    key={customer._id}
                    whileHover={{ backgroundColor: "#f8fafc" }}
                    className="border-b"
                  >

                    {/* Customer */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-4">

                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            customer.name || "User"
                          )}&background=10b981&color=fff`}
                          alt={customer.name}
                          className="w-12 h-12 rounded-full"
                        />

                        <div>

                          <h3 className="font-semibold">

                            {customer.name}

                          </h3>

                          <p className="text-sm text-slate-500">

                            Customer ID:
                            {" "}
                            {customer._id?.slice(-6)}

                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Contact */}

                    <td className="px-6 py-4">

                      <div className="space-y-2">

                        <div className="flex items-center gap-2">

                          <Mail size={14} />

                          <span className="text-sm">

                            {customer.email}

                          </span>

                        </div>

                        <div className="flex items-center gap-2">

                          <Phone size={14} />

                          <span className="text-sm">

                            {customer.phone || "-"}

                          </span>

                        </div>

                      </div>

                    </td>

                    {/* Orders */}

                    <td className="px-6 py-4">

                      <span className="font-semibold">

                        {customer.totalOrders || 0}

                      </span>

                    </td>

                    {/* Total Spent */}

                    <td className="px-6 py-4">

                      <span className="font-bold text-emerald-600">

                        ₹
                        {Number(
                          customer.totalSpent || 0
                        ).toLocaleString()}

                      </span>

                    </td>

                    {/* Address */}

                    <td className="px-6 py-4">

                      <div className="max-w-xs truncate">

                        {customer.address ||
                          customer.city ||
                          "-"}

                      </div>

                    </td>

                    {/* Actions */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >

                          View

                        </button>

                        <button
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
                        >

                          Orders

                        </button>

                      </div>

                    </td>

                  </motion.tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Footer */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-sm text-slate-500">

          Showing {filteredCustomers.length} of {customers.length} customers

        </p>

        <div className="flex gap-2">

          <button className="px-4 py-2 border rounded-lg hover:bg-slate-100">

            Previous

          </button>

          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg">

            1

          </button>

          <button className="px-4 py-2 border rounded-lg hover:bg-slate-100">

            Next

          </button>

        </div>

      </div>

    </div>

  );

}