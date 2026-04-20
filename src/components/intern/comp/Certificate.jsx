"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Download } from "lucide-react";
import { CiShare1 } from "react-icons/ci";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CertificateDashboard({ iemail }) {
  const [intern, setIntern] = useState(null);
  const [loading, setLoading] = useState(true);

  const certificateRef = useRef();

  const isCertificateAvailable = intern?.certificate === true;

  // FETCH INTERN
  useEffect(() => {
    const fetchIntern = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/interns");
        const data = await res.json();

        const currentIntern = data.find(
          (i) =>
            i.email?.toLowerCase().trim() ===
            iemail?.toLowerCase().trim()
        );

        setIntern(currentIntern || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (iemail) fetchIntern();
    else setLoading(false);
  }, [iemail]);

  // ✅ PERFECT PDF DOWNLOAD (NO CROP)
  const handleDownload = async () => {
    if (!isCertificateAvailable) return;

    const element = certificateRef.current;

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height], // 🔥 dynamic height (no crop)
    });

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      canvas.width,
      canvas.height
    );

    pdf.save(`${intern?.name}-certificate.pdf`);
  };

  if (loading) {
    return (
      <p className="p-6 text-center text-gray-500">
        Loading...
      </p>
    );
  }

  if (!intern) {
    return (
      <p className="p-6 text-center text-red-500">
        No intern found
      </p>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <div>
          <h1 className="text-xl font-semibold">
            Certificate Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Welcome {intern?.name}
          </p>
        </div>
        <Bell />
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <div className="bg-white p-6 rounded-xl shadow flex items-center justify-center">

          {!isCertificateAvailable ? (
            <div className="text-center text-gray-500">
              <h2 className="text-lg font-semibold">
                Certificate Pending
              </h2>
              <p className="text-sm mt-2">
                Will appear after approval
              </p>
            </div>
          ) : (

            <div
              ref={certificateRef}
              className="w-full max-w-4xl aspect-[1.414/1] bg-white border-[8px] border-indigo-600 p-12 rounded-xl text-center"
            >

              <h1 className="text-3xl font-bold text-indigo-700">
                CERTIFICATE
              </h1>

              <p className="text-gray-500 mt-1">
                OF COMPLETION
              </p>

              <div className="my-6 border-t w-24 mx-auto"></div>

              <p className="text-gray-600">
                This is proudly presented to
              </p>

              <h2 className="text-4xl font-semibold mt-4 text-gray-800">
                {intern?.name}
              </h2>

              <div className="my-6 border-t w-40 mx-auto"></div>

              <p className="text-gray-600">
                For successfully completing
              </p>

              <h3 className="text-2xl mt-2 text-indigo-600">
                {intern?.duration} Months Internship
              </h3>

              {/* SIGNATURE */}
              <div className="flex justify-between mt-16 text-sm">

                <div className="text-left">
                  <p className="font-semibold">
                    Solstra Info IT
                  </p>
                  <div className="border-t w-40 mt-6"></div>
                  <p className="text-xs mt-1">
                    Authorized Signatory
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">Date</p>
                  <div className="border-t w-40 mt-6 ml-auto"></div>
                  <p className="text-xs mt-1">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="text-lg font-semibold mb-4">
            Status
          </h3>

          <div
            className={`inline-block px-4 py-1 rounded-full text-sm font-semibold
              ${
                isCertificateAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {isCertificateAvailable ? "Approved" : "Pending"}
          </div>

          <button
            onClick={handleDownload}
            disabled={!isCertificateAvailable}
            className={`w-full mt-6 py-3 rounded-lg text-white flex justify-center gap-2
              ${
                isCertificateAvailable
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            <Download size={18} />
            Download PDF
          </button>

          <button className="w-full mt-4 flex justify-center gap-2 text-indigo-600 hover:underline">
            <CiShare1 />
            Verify Certificate
          </button>

        </div>
      </div>
    </div>
  );
}