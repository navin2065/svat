import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Quotation = ({ type = 'export', loadedData = null, triggerToast = null }) => {
  const [deliveryCharges, setDeliveryCharges] = useState({
    mumbaiCbm: '',
    mumbaiFabric: '',
    tuticorin: '',
    chennaiSea: '',
    chennaiAir: '',
    bangaloreAir: ''
  });
  const [domesticLocation, setDomesticLocation] = useState({
    from: 'Tirupur',
    to: 'Mumbai'
  });
  const [domesticRates, setDomesticRates] = useState([
    '', '', '', '', '', '', ''
  ]);

  const handleDomesticRateChange = (index, value) => {
    const newRates = [...domesticRates];
    newRates[index] = value;
    setDomesticRates(newRates);
  };

  useEffect(() => {
    if (loadedData && loadedData.data) {
      if (loadedData.type === 'export' && loadedData.data.deliveryCharges) {
        setDeliveryCharges(loadedData.data.deliveryCharges);
      } else if (loadedData.type === 'domestic') {
        if (loadedData.data.domesticLocation) setDomesticLocation(loadedData.data.domesticLocation);
        if (loadedData.data.domesticRates) setDomesticRates(loadedData.data.domesticRates);
      }
    } else {
      setDeliveryCharges({
        mumbaiCbm: '',
        mumbaiFabric: '',
        tuticorin: '',
        chennaiSea: '',
        chennaiAir: '',
        bangaloreAir: ''
      });
      setDomesticLocation({
        from: 'Tirupur',
        to: 'Mumbai'
      });
      setDomesticRates(['', '', '', '', '', '', '']);
    }
  }, [loadedData, type]);

  const handleSaveQuotation = async () => {
    const quoteId = loadedData && loadedData.id ? loadedData.id : `QO-${Date.now().toString().slice(-5)}`;
    
    const newQuote = {
      id: quoteId,
      type: type,
      from: type === 'domestic' ? domesticLocation.from : 'Tirupur',
      to: type === 'domestic' ? domesticLocation.to : 'Multiple (Export)',
      date: loadedData && loadedData.date ? loadedData.date : new Date().toLocaleDateString('en-IN'),
      data: {
        deliveryCharges,
        domesticLocation,
        domesticRates
      },
      createdAt: Date.now()
    };

    try {
      await setDoc(doc(db, 'quotations', quoteId), newQuote);
      if (triggerToast) {
        triggerToast('Quotation saved successfully!');
      } else {
        alert('Quotation saved successfully!');
      }
    } catch (err) {
      console.error("Error saving quotation to Firestore:", err);
      // Fallback
      const savedQuotes = JSON.parse(localStorage.getItem('svat_saved_quotations') || '[]');
      const index = savedQuotes.findIndex(q => q.id === quoteId);
      if (index > -1) {
        savedQuotes[index] = newQuote;
      } else {
        savedQuotes.unshift(newQuote);
      }
      localStorage.setItem('svat_saved_quotations', JSON.stringify(savedQuotes));
      if (triggerToast) {
        triggerToast('Quotation saved locally!');
      } else {
        alert('Quotation saved locally!');
      }
    }
  };

  const handleDownloadPDF = (contentId, filename) => {
    const element = document.getElementById(contentId);
    if (!element) return;
    
    const opt = {
      margin:       0.2,
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 3.5, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    window.html2pdf().set(opt).from(element).save();
  };

  const inputStyle = {
    width: '100%', 
    border: 'none', 
    background: 'transparent', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: '12px', 
    outline: 'none',
    fontFamily: '"Times New Roman", Times, serif'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {type === 'export' ? (
        <>
          {/* Container for the Quotation Content - This gets converted to PDF */}
          <div id="quotation-content" style={{ backgroundColor: '#fff', color: '#000', padding: '20px 30px', fontFamily: '"Times New Roman", Times, serif', width: '100%', maxWidth: '800px', border: '1px solid #ccc', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', textDecoration: 'underline', margin: '0 0 4px 0' }}>
            SREE VAARAHI AMMAN TRANSPORTS
          </h1>
          <h2 style={{ fontSize: '13px', fontWeight: 'bold', textDecoration: 'underline', margin: '0 0 8px 0' }}>
            EXPERT IN EXPORT CARGO MOVERS
          </h2>
          <p style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
            (REGULAR SERVICE TO: MUMBAI, CHENNAI, BANGALORE, TUTICORIN, COCHIN, PAN INDIA)
          </p>
          <p style={{ fontSize: '11px', margin: '0 0 4px 0' }}>
            228/1, Rakkiyapalayam, Avinashi, Tirupur - 641 654.
          </p>
          <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
            Contact: +91-9655237104, +91-9655235088, +91-9585907007
          </p>
          <p style={{ fontSize: '11px', margin: '0 0 8px 0' }}>
            MAIL ID. <a href="mailto:Vaarahitpt104@gmail.com" style={{ color: 'blue', textDecoration: 'underline' }}>Vaarahitpt104@gmail.com</a> , website ; <a href="http://www.sreevaarahiammantransports.com" style={{ color: 'black', textDecoration: 'none' }}>www.sreevaarahiammantransports.com</a>
          </p>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', textDecoration: 'underline', margin: '0' }}>
            RATE QUATATION
          </h3>
        </div>

        {/* Address */}
        <div style={{ marginBottom: '15px', textAlign: 'center', fontSize: '12px' }}>
          <p style={{ fontWeight: 'bold', margin: '0', textAlign: 'left' }}>To,</p>
          <p style={{ margin: '0' }}>|</p>
          <p style={{ margin: '0' }}>PERLI EXPORTS</p>
          <p style={{ margin: '0' }}>TIRUPUR</p>
        </div>

        {/* Full Load Section */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 'bold', textDecoration: 'underline', margin: '0' }}>
            FULL LOAD
          </h4>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', textAlign: 'center', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#ADD8E6' }}>
              <th style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>CONTAINER SIZE</th>
              <th style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>Jeep</th>
              <th style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>14 FEET</th>
              <th style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>17 FEET</th>
              <th style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>20 FEET</th>
            </tr>
            <tr style={{ backgroundColor: '#ADD8E6' }}>
              <th style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>CAPACITY - (CBM)</th>
              <th style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>1 - 7 CBM</th>
              <th style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>8 - 15 CBM</th>
              <th style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>16 - 21 CBM</th>
              <th style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>22 - 31 CBM</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>TUTICORIN</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>8800</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>13000</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>15000</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>17000</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>CHENNAI - AIR</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>9000</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>13500</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>16000</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>18000</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>CHENNAI - SEA</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>9500</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>14000</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>16500</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>18000</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>COCHIN</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>9000</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>13500</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>14500</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>16500</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>MUMBAI</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>30000</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>-</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>-</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>42000</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>BANGALORE</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>8000</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>11500</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>13000</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>15500</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>LOCAL ICD</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>2500</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>3500</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>4000</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>5000</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>HALTING</td>
              <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>800</td>
              <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>1000</td>
              <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>1500</td>
              <td style={{ border: '1px solid #000', padding: '3px', fontWeight: 'bold' }}>1800</td>
            </tr>
          </tbody>
        </table>

        {/* CBM RATE Section */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 'bold', textDecoration: 'underline', margin: '0' }}>
            CBM RATE
          </h4>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', textAlign: 'center', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#ADD8E6' }}>
              <th style={{ border: '1px solid #000', padding: '4px' }}></th>
              <th style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold' }}>PRICE PER CBM</th>
              <th style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold' }}>PICK UP AND<br />DELIVERY CHARGES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '8px' }}>TIRUPUR TO MUMBAI PER CBM</td>
              <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold' }}>1400</td>
              <td style={{ border: '1px solid #000', padding: '0', fontWeight: 'bold', width: '20%' }}>
                <input 
                  type="text" 
                  value={deliveryCharges.mumbaiCbm} 
                  onChange={(e) => setDeliveryCharges({...deliveryCharges, mumbaiCbm: e.target.value})} 
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '8px' }}>TIRUPUR TO MUMBAI FABRIC</td>
              <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold' }}>7 Rs per kg</td>
              <td style={{ border: '1px solid #000', padding: '0', fontWeight: 'bold' }}>
                <input 
                  type="text" 
                  value={deliveryCharges.mumbaiFabric} 
                  onChange={(e) => setDeliveryCharges({...deliveryCharges, mumbaiFabric: e.target.value})} 
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '8px' }}>TIRUPUR TO TUTICORIN</td>
              <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold' }}>850</td>
              <td style={{ border: '1px solid #000', padding: '0', fontWeight: 'bold' }}>
                <input 
                  type="text" 
                  value={deliveryCharges.tuticorin} 
                  onChange={(e) => setDeliveryCharges({...deliveryCharges, tuticorin: e.target.value})} 
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '8px' }}>TIRUPUR TO CHENNAI - SEA</td>
              <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold' }}>1000</td>
              <td style={{ border: '1px solid #000', padding: '0', fontWeight: 'bold' }}>
                <input 
                  type="text" 
                  value={deliveryCharges.chennaiSea} 
                  onChange={(e) => setDeliveryCharges({...deliveryCharges, chennaiSea: e.target.value})} 
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '8px' }}>TIRUPUR TO CHENNAI - AIR</td>
              <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold' }}>1000</td>
              <td style={{ border: '1px solid #000', padding: '0', fontWeight: 'bold' }}>
                <input 
                  type="text" 
                  value={deliveryCharges.chennaiAir} 
                  onChange={(e) => setDeliveryCharges({...deliveryCharges, chennaiAir: e.target.value})} 
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '8px' }}>TIRUPUR TO BANGALORE - AIR</td>
              <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold' }}>1000</td>
              <td style={{ border: '1px solid #000', padding: '0', fontWeight: 'bold' }}>
                <input 
                  type="text" 
                  value={deliveryCharges.bangaloreAir} 
                  onChange={(e) => setDeliveryCharges({...deliveryCharges, bangaloreAir: e.target.value})} 
                  style={inputStyle}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer Notes */}
        <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
          <p style={{ fontWeight: 'bold', margin: '4px 0' }}>
            Urgent Load Consider as a Full Load Only Timing Load
          </p>
          <p style={{ fontWeight: 'bold', margin: '4px 0' }}>
            This Price Is Valid for Present Fuel Price; Festival & Lockdown time Extra Charges.
          </p>
        </div>
      </div>
      
      {/* Download/Save Buttons Container */}
      <div style={{ display: 'flex', gap: '15px', marginTop: '20px', marginBottom: '40px' }}>
        <button 
          onClick={handleSaveQuotation}
          style={{ 
            backgroundColor: '#28A745', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28A745'}
        >
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span>
          Save Quotation
        </button>
        <button 
          onClick={() => handleDownloadPDF('quotation-content', 'SVAT_Rate_Quotation.pdf')} 
          style={{ 
            backgroundColor: '#007BFF', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007BFF'}
        >
          <Download size={20} />
          Download PDF
        </button>
      </div>
        </>
      ) : (
        <>
          <div id="domestic-quotation-content" style={{ backgroundColor: '#fff', color: '#000', padding: '40px 50px', fontFamily: '"Times New Roman", Times, serif', width: '100%', maxWidth: '800px', minHeight: '1050px', border: '1px solid #ccc', boxShadow: '0 0 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #000', paddingBottom: '20px' }}>
              <div style={{ border: '1.5px solid #000', padding: '10px', marginRight: '30px', width: '120px', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <img src="/logo.png" alt="SVAT Logo" style={{ width: '100px', height: '100px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                <span style={{ display: 'none', fontWeight: 'bold', textAlign: 'center', fontSize: '18px' }}>Logo<br/>SVAT</span>
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0', textTransform: 'uppercase' }}>SREE VAARAHI AMMAN Transports</h1>
                <p style={{ margin: '0 0 6px 0', fontSize: '16px' }}><strong>Address:-</strong> 228/1, Rakkiyapalayam, Avinashi, Tirupur - 641 654.</p>
                <p style={{ margin: '0 0 6px 0', fontSize: '16px' }}><strong>www :-</strong> www.sreevaarahiammantransports.com</p>
                <p style={{ margin: '0', fontSize: '16px' }}><strong>mail :-</strong> Vaarahitpt104@gmail.com</p>
              </div>
            </div>

            {/* From / To Inputs */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '40px', fontSize: '18px', fontWeight: 'bold' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span>From</span>
                <input 
                  type="text" 
                  value={domesticLocation.from} 
                  onChange={(e) => setDomesticLocation({...domesticLocation, from: e.target.value})}
                  style={{ border: '1px solid #000', padding: '6px 12px', outline: 'none', width: '200px', fontFamily: '"Times New Roman", Times, serif', fontSize: '18px', fontWeight: 'bold' }} 
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span>To</span>
                <input 
                  type="text" 
                  value={domesticLocation.to} 
                  onChange={(e) => setDomesticLocation({...domesticLocation, to: e.target.value})}
                  style={{ border: '1px solid #000', padding: '6px 12px', outline: 'none', width: '200px', fontFamily: '"Times New Roman", Times, serif', fontSize: '18px', fontWeight: 'bold' }} 
                />
              </div>
            </div>

            {/* Domestic Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 'auto', textAlign: 'center', fontSize: '16px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #000', padding: '15px', fontWeight: 'bold', fontSize: '16px' }}>Container Size</th>
                  <th style={{ border: '1px solid #000', padding: '15px', fontWeight: 'bold', fontSize: '16px' }}>Weight</th>
                  <th style={{ border: '1px solid #000', padding: '15px', fontWeight: 'bold', fontSize: '16px' }}>Rates</th>
                  <th style={{ border: '1px solid #000', padding: '15px', fontWeight: 'bold', fontSize: '16px' }}>Halting Charge</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: '20 FT', weight: '6 mt', rates: '35,000', halting: '1500' },
                  { size: '22 FT', weight: '6 mt', rates: '36,000', halting: '1500' },
                  { size: '24 FT', weight: '7 mt', rates: '40,000', halting: '2000' },
                  { size: '32 FT SXL', weight: '7 mt', rates: '48,000', halting: '2000' },
                  { size: '32 FT SXL', weight: '9 mt', rates: '52,000', halting: '2000' },
                  { size: '32 FT MXL', weight: '15 mt', rates: '57,000', halting: '2500' },
                  { size: '32 FT MXL', weight: '18 mt', rates: '62,000', halting: '2500' }
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #000', padding: '15px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '20px' }}>{row.size}</td>
                    <td style={{ border: '1px solid #000', padding: '15px', fontWeight: 'bold' }}>{row.weight}</td>
                    <td style={{ border: '1px solid #000', padding: '0', fontWeight: 'bold' }}>
                      <input 
                        type="text" 
                        value={domesticRates[idx]} 
                        onChange={(e) => handleDomesticRateChange(idx, e.target.value)} 
                        style={{ ...inputStyle, padding: '15px 0', fontSize: '16px' }}
                        placeholder={row.rates}
                      />
                    </td>
                    <td style={{ border: '1px solid #000', padding: '15px', fontWeight: 'bold' }}>{row.halting}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer Notes */}
            <div style={{ fontSize: '15px', lineHeight: '1.6', marginTop: '40px' }}>
              <p style={{ fontWeight: 'bold', margin: '8px 0', fontSize: '16px', textDecoration: 'underline' }}>
                As per detailes in Export Quotation
              </p>
              <p style={{ fontWeight: 'bold', margin: '8px 0', fontSize: '15px' }}>
                Urgent Load Consider as a Full Load Only Timing Load
              </p>
              <p style={{ fontWeight: 'bold', margin: '8px 0', fontSize: '15px' }}>
                This Price Is Valid for Present Fuel Price; Festival & Lockdown time Extra Charges.
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px', marginBottom: '40px' }}>
            <button 
              onClick={handleSaveQuotation}
              style={{ 
                backgroundColor: '#28A745', 
                color: 'white', 
                border: 'none', 
                padding: '12px 24px', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28A745'}
            >
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span>
              Save Quotation
            </button>
            <button 
              onClick={() => handleDownloadPDF('domestic-quotation-content', 'SVAT_Domestic_Quotation.pdf')} 
              style={{ 
                backgroundColor: '#007BFF', 
                color: 'white', 
                border: 'none', 
                padding: '12px 24px', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007BFF'}
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Quotation;
