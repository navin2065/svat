import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, FileText, History, LogOut, Plus, Trash2, Printer, Save, IndianRupee, Calendar, TrendingUp, Truck } from 'lucide-react';
import LrCreator from './LrCreator';
import Quotation from './Quotation';

const SVATLogo = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1.5px solid #000000',
    borderRadius: '6px',
    padding: '4px',
    width: '105px',
    height: '105px',
    backgroundColor: '#FFFFFF',
    flexShrink: 0,
    position: 'relative'
  }}>


    <img
      src="/logo.png"
      alt="SVAT Logo"
      style={{
        width: '95px',
        height: '95px',
        objectFit: 'contain',
        filter: 'brightness(1.2) contrast(1.1) saturate(1.15)'
      }}
    />
  </div>
);

// Indian Numbering System to Words conversion helper
const numberToWords = (num) => {
  const integerPart = Math.floor(num);
  if (integerPart === 0) return 'INR ZERO ONLY';

  const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  const b = ['', '', 'twenty ', 'thirty ', 'forty ', 'fifty ', 'sixty ', 'seventy ', 'eighty ', 'ninety '];

  const formatWord = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + a[n % 10];
    if (n < 1000) return a[Math.floor(n / 100)] + 'hundred ' + (n % 100 !== 0 ? 'and ' + formatWord(n % 100) : '');
    if (n < 100000) return formatWord(Math.floor(n / 1000)) + 'thousand ' + (n % 1000 !== 0 ? formatWord(n % 1000) : '');
    if (n < 10000000) return formatWord(Math.floor(n / 100000)) + 'lakh ' + (n % 100000 !== 0 ? formatWord(n % 100000) : '');
    return formatWord(Math.floor(n / 10000000)) + 'crore ' + (n % 10000000 !== 0 ? formatWord(n % 10000000) : '');
  };

  const words = formatWord(integerPart);
  return 'INR ' + words.trim().replace(/\s+/g, ' ').toUpperCase() + ' ONLY';
};

// Autocomplete suggestions dropdown element
const SuggestionsDropdown = ({ query, list, onSelect, onClose }) => {
  const filtered = list.filter(val =>
    val.toLowerCase().includes((query || '').toLowerCase()) && val.toLowerCase() !== (query || '').toLowerCase()
  );

  useEffect(() => {
    const handleOutsideClick = () => {
      setTimeout(onClose, 200);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [onClose]);

  if (filtered.length === 0) return null;

  return (
    <ul style={{
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      maxHeight: '150px',
      overflowY: 'auto',
      zIndex: 50,
      listStyle: 'none',
      margin: 0,
      padding: 0,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
    }}>
      {filtered.map((val, idx) => (
        <li
          key={idx}
          style={{
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            color: 'var(--text-dark)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            transition: 'background-color 0.2s'
          }}
          onMouseDown={(e) => {
            e.preventDefault(); // Prevents textbox blur from closing this list prematurely
            onSelect(val);
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(241, 180, 0, 0.15)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          {val}
        </li>
      ))}
    </ul>
  );
};

const DEFAULT_INVOICE = {
  companyName: 'SREE VAARAHI AMMAN TRANSPORTS',
  companyAddress: 'NO: 228/1 RAKKIYAPALAYAM, AVINASHI, TIRUPUR - 641654',
  companyGst: '33AVDPTS410D1Z0',
  companyState: 'Tamil Nadu, Code: 33',
  companyEmail: 'varahitpt104@gmail.com',
  companyWebsite: 'www.sreevaarahiammantransports.com',
  debitNoteNo: '',
  date: '',
  originalInvoiceNo: '',
  originalInvoiceDate: '',
  otherRefs: '',
  consigneeName: '',
  consigneeAddress: '',
  consigneeGst: '',
  consigneeState: '',
  consigneeEmail: '',
  vesselFlightNo: '',
  placeOfReceipt: '',
  portOfLoading: '',
  portOfDischarge: '',
  ctns: '',
  cbm: '',
  weight: '',
  items: [
    { particulars: '', quantity: '', rate: '', per: '', amount: '' }
  ],
  bankName: 'BANK OF BARODA',
  bankAccount: '18930200002289',
  bankBranch: 'TIRUPPUR MAIN & BARB0COTTON',
  bankHolderName: 'SREE VAARAHI AMMAN TRANSPORTS',
  signatoryName: 'P. SARANYA',
  gstPercentage: '',
  wordsOverride: ''
};

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('creator');
  const [isQuotationMenuOpen, setIsQuotationMenuOpen] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_INVOICE);
  const [loadedLr, setLoadedLr] = useState(null);
  const [loadedQuotation, setLoadedQuotation] = useState(null);
  const [historySubTab, setHistorySubTab] = useState('dn');

  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const cardRef = useRef(null);
  const [cardHeight, setCardHeight] = useState(1123);

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        // Calculate available width minus some padding
        const availableWidth = previewContainerRef.current.clientWidth - 40; 
        const newScale = availableWidth / 794; // 794 is the invoice-preview-card width
        setPreviewScale(newScale < 1 ? newScale : 1);
      }
    };
    
    updateScale();
    setTimeout(updateScale, 100); 
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [activeTab]);

  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setCardHeight(Math.round(entry.contentRect.height));
      }
    });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [activeTab]);

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('svat_saved_invoices');
    return saved ? JSON.parse(saved) : [
      {
        id: 'SVAT/DN/26-27/13',
        consignee: 'NEW SABARI SASTHA SHIPPING SERVICES',
        date: '30-April-26',
        amount: 62000,
        status: 'paid'
      },
      {
        id: 'SVAT/DN/26-27/12',
        consignee: 'NEW SABARI SASTHA SHIPPING SERVICES',
        date: '15-April-26',
        amount: 45000,
        status: 'paid'
      }
    ];
  });

  const [savedLrs, setSavedLrs] = useState(() => {
    return JSON.parse(localStorage.getItem('svat_saved_lrs') || '[]');
  });

  const [savedQuotations, setSavedQuotations] = useState(() => {
    return JSON.parse(localStorage.getItem('svat_saved_quotations') || '[]');
  });

  useEffect(() => {
    if (activeTab === 'history') {
      setSavedLrs(JSON.parse(localStorage.getItem('svat_saved_lrs') || '[]'));
      setSavedQuotations(JSON.parse(localStorage.getItem('svat_saved_quotations') || '[]'));
    }
  }, [activeTab]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (!tabName.startsWith('quotation')) setLoadedQuotation(null);
    if (tabName !== 'lr') setLoadedLr(null);
  };

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, type: '', id: null });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const [subtotal, setSubtotal] = useState(0);
  const [cgstAmount, setCgstAmount] = useState(0);
  const [sgstAmount, setSgstAmount] = useState(0);
  const [igstAmount, setIgstAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amountInWords, setAmountInWords] = useState('');

  // Autocomplete Particulars suggestion state
  const [suggestions, setSuggestions] = useState(() => {
    const saved = localStorage.getItem('svat_particulars_suggestions');
    return saved ? JSON.parse(saved) : [
      "VEHICLE HIRING CHARGES",
      "HALTING CHARGES",
      "HALTING CHARGES (2 DAYS)",
      "CONTAINER HANDLING CHARGES",
      "TRANSPORTATION CHARGES",
      "CONTAINER LOADING CHARGES",
      "PORT OUT FLOW CHARGES"
    ];
  });
  const [activeRowIdx, setActiveRowIdx] = useState(null);

  // Re-calculate totals, GST, and words dynamically (sanitizing commas/symbols)
  useEffect(() => {
    const calculatedSubtotal = formData.items.reduce((acc, item) => {
      const cleanAmtStr = (item.amount || '').toString().replace(/[^0-9.]/g, '');
      if (cleanAmtStr !== '') {
        return acc + (parseFloat(cleanAmtStr) || 0);
      }
      const cleanQtyStr = (item.quantity || '').toString().replace(/[^0-9.]/g, '');
      const cleanRateStr = (item.rate || '').toString().replace(/[^0-9.]/g, '');
      const q = parseFloat(cleanQtyStr) || 0;
      const r = parseFloat(cleanRateStr) || 0;
      return acc + (q * r);
    }, 0);

    setSubtotal(calculatedSubtotal);

    const gstPct = parseFloat(formData.gstPercentage) || 0;
    const cgstRate = gstPct / 2;
    const sgstRate = gstPct / 2;

    const cgst = (calculatedSubtotal * cgstRate) / 100;
    const sgst = (calculatedSubtotal * sgstRate) / 100;

    const grandTotal = calculatedSubtotal + cgst + sgst;

    setCgstAmount(cgst);
    setSgstAmount(sgst);
    setIgstAmount(0); // IGST removed
    setTotalAmount(grandTotal);

    if (!formData.wordsOverride) {
      setAmountInWords(numberToWords(grandTotal));
    } else {
      setAmountInWords(formData.wordsOverride);
    }
  }, [formData.items, formData.wordsOverride, formData.gstPercentage]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearForm = () => {
    setFormData(prev => ({
      ...prev,
      debitNoteNo: '',
      date: '',
      originalInvoiceNo: '',
      originalInvoiceDate: '',
      otherRefs: '',
      consigneeName: '',
      consigneeAddress: '',
      consigneeGst: '',
      consigneeState: '',
      consigneeEmail: '',
      vesselFlightNo: '',
      placeOfReceipt: '',
      portOfLoading: '',
      portOfDischarge: '',
      ctns: '',
      cbm: '',
      weight: '',
      items: [
        { particulars: '', quantity: '', rate: '', per: '', amount: '' }
      ],
      roundOff: '',
      gstCategory: 'exempted',
      wordsOverride: ''
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    // Automatically calculate amount in form row when Qty or Rate changes
    if (field === 'quantity' || field === 'rate') {
      const qStr = field === 'quantity' ? value : newItems[index].quantity;
      const rStr = field === 'rate' ? value : newItems[index].rate;
      const qClean = (qStr || '').toString().replace(/[^0-9.]/g, '');
      const rClean = (rStr || '').toString().replace(/[^0-9.]/g, '');
      const q = parseFloat(qClean) || 0;
      const r = parseFloat(rClean) || 0;
      if (q > 0 && r > 0) {
        newItems[index].amount = (q * r).toString();
      }
    }

    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { particulars: '', quantity: '', rate: '', per: '', amount: '' }]
    }));
  };

  const removeItemRow = (index) => {
    if (formData.items.length <= 1) return;
    const newItems = formData.items.filter((_, idx) => idx !== index);
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const handleSaveInvoice = () => {
    const newInvoiceObj = {
      ...formData,
      id: formData.debitNoteNo || `DN-${Date.now().toString().slice(-5)}`,
      consignee: formData.consigneeName,
      date: formData.date,
      amount: totalAmount,
      status: 'pending'
    };

    let updated;
    if (invoices.some(inv => inv.id === newInvoiceObj.id)) {
      updated = invoices.map(inv => inv.id === newInvoiceObj.id ? newInvoiceObj : inv);
    } else {
      updated = [newInvoiceObj, ...invoices];
    }
    setInvoices(updated);
    localStorage.setItem('svat_saved_invoices', JSON.stringify(updated));

    // Save newly entered particulars to suggestion list auto-complete
    const updatedSuggestions = [...suggestions];
    let suggestionsChanged = false;
    formData.items.forEach(item => {
      const p = (item.particulars || '').trim();
      if (p && !updatedSuggestions.includes(p)) {
        updatedSuggestions.push(p);
        suggestionsChanged = true;
      }
    });
    if (suggestionsChanged) {
      setSuggestions(updatedSuggestions);
      localStorage.setItem('svat_particulars_suggestions', JSON.stringify(updatedSuggestions));
    }

    triggerToast('Invoice saved successfully!');
  };

  const handleDownloadPDF = () => {
    const element = document.querySelector('.invoice-preview-card');
    if (!element) return;

    // Replace slashes with underscores for safe filename
    const filename = `${(formData.debitNoteNo || 'invoice').replace(/\//g, '_')}.pdf`;

    const opt = {
      margin: 0.15,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3.5, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    const scaleWrapper = document.getElementById('invoice-scale-wrapper');
    if (scaleWrapper) {
      scaleWrapper.style.transform = 'scale(1)';
    }

    window.html2pdf().set(opt).from(element).save().then(() => {
      if (scaleWrapper) {
        scaleWrapper.style.transform = `scale(${previewScale})`;
      }
    });
  };

  const handleLoadInvoice = (historyItem) => {
    setFormData({
      ...DEFAULT_INVOICE,
      ...historyItem
    });
    setActiveTab('creator');
  };

  const confirmDelete = () => {
    const { type, id } = deleteConfirm;
    if (type === 'dn') {
      const updated = invoices.filter(inv => inv.id !== id);
      setInvoices(updated);
      localStorage.setItem('svat_saved_invoices', JSON.stringify(updated));
      triggerToast('Invoice deleted successfully!');
    } else if (type === 'lr') {
      const updated = savedLrs.filter(lr => lr.id !== id);
      setSavedLrs(updated);
      localStorage.setItem('svat_saved_lrs', JSON.stringify(updated));
      triggerToast('Lorry Receipt deleted successfully!');
    } else if (type === 'quote') {
      const updated = savedQuotations.filter(q => q.id !== id);
      setSavedQuotations(updated);
      localStorage.setItem('svat_saved_quotations', JSON.stringify(updated));
      triggerToast('Quotation deleted successfully!');
    }
    setDeleteConfirm({ show: false, type: '', id: null });
  };

  // Calculate dynamic charts data based on state variables: invoices, savedLrs, savedQuotations
  // Chart 1: Revenue Trends (aggregated by Jan-Dec calendar months)
  const chartDataPoints = (() => {
    const getInvoiceMonthIndex = (dateStr) => {
      if (!dateStr) return -1;
      const str = dateStr.toLowerCase();
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      for (let i = 0; i < 12; i++) {
        if (str.includes(months[i])) return i;
      }
      const parts = str.split(/[-/ ]+/);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          const m = parseInt(parts[1], 10);
          if (m >= 1 && m <= 12) return m - 1;
        }
        const m = parseInt(parts[1], 10);
        if (m >= 1 && m <= 12) return m - 1;
      }
      try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) return d.getMonth();
      } catch (e) { }
      return -1;
    };

    const monthlyRevenue = Array(12).fill(0);
    // Accumulate invoice amounts by month
    invoices.forEach((inv) => {
      const monthIdx = getInvoiceMonthIndex(inv.date);
      if (monthIdx >= 0 && monthIdx < 12) {
        monthlyRevenue[monthIdx] += Number(inv.amount) || 0;
      }
    });

    const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const hasRealData = monthlyRevenue.some(amt => amt > 0);

    // Map to coordinates (X from 40 to 480, Y from 180 to 30)
    const points = monthlyLabels.map((label, idx) => {
      const amt = hasRealData ? monthlyRevenue[idx] : (15000 + (idx % 3) * 12000 + (idx % 5) * 8000);
      return { label, amount: amt };
    });

    const maxVal = Math.max(...points.map(p => p.amount), 10000);

    return points.map((item, idx) => {
      const x = 40 + idx * 40;
      const y = 180 - (item.amount / maxVal) * 140;
      return { x, y, label: item.label, amount: item.amount, isReal: hasRealData && monthlyRevenue[idx] > 0 };
    });
  })();

  // Generate SVG path strings
  const linePathD = chartDataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const areaPathD = chartDataPoints.length > 0
    ? `${linePathD} L ${chartDataPoints[chartDataPoints.length - 1].x},180 L ${chartDataPoints[0].x},180 Z`
    : '';

  // Chart 2: Cargo Distribution based on actual counts
  const donutSegments = (() => {
    const invCount = invoices.length;
    const lrCount = savedLrs.length;
    const expCount = savedQuotations.filter(q => q.type === 'export').length;
    const domCount = savedQuotations.filter(q => q.type === 'domestic').length;

    const totalItems = invCount + lrCount + expCount + domCount;

    const parts = totalItems > 0 ? [
      { label: 'Invoices', count: invCount, color: 'var(--primary)', pct: Math.round((invCount / totalItems) * 100) },
      { label: 'Lorry Receipts', count: lrCount, color: 'var(--text-dark)', pct: Math.round((lrCount / totalItems) * 100) },
      { label: 'Export Quotes', count: expCount, color: '#64748B', pct: Math.round((expCount / totalItems) * 100) },
      { label: 'Domestic Quotes', count: domCount, color: '#cbd5e1', pct: Math.round((domCount / totalItems) * 100) }
    ] : [
      { label: 'Invoices', count: 4, color: 'var(--primary)', pct: 40 },
      { label: 'Lorry Receipts', count: 3, color: 'var(--text-dark)', pct: 30 },
      { label: 'Export Quotes', count: 2, color: '#64748B', pct: 20 },
      { label: 'Domestic Quotes', count: 1, color: '#cbd5e1', pct: 10 }
    ];

    // Recalculate segment percentages to make sure they sum up to 100
    const totalPct = parts.reduce((a, b) => a + b.pct, 0);
    if (totalPct !== 100 && totalPct > 0) {
      const nonZeroIdx = parts.findIndex(p => p.pct > 0);
      if (nonZeroIdx !== -1) {
        parts[nonZeroIdx].pct += (100 - totalPct);
      }
    }

    const circumference = 314.16;
    let currentOffset = 0;
    return parts.map((d) => {
      const len = (d.pct / 100) * circumference;
      const offset = currentOffset;
      currentOffset -= len;
      return {
        ...d,
        dasharray: `${len} ${circumference}`,
        offset: offset
      };
    });
  })();

  // Determine Title based on GST percentage
  const gstPct = parseFloat(formData.gstPercentage) || 0;
  const billTitle = gstPct > 0 ? "Tax Invoice" : "Bill Of Supply";
  const displayCgstRate = gstPct / 2;
  const displaySgstRate = gstPct / 2;

  return (
    <div className="dashboard-layout">
      {/* Mobile Top Header */}
      <div className="mobile-dashboard-header">
        <div className="logo-container" style={{ fontSize: '1.2rem' }}>
          <Truck className="logo-icon" style={{ width: '24px', height: '24px' }} />
          <span className="logo-text">SVAT</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>munik</span>
          <div className="user-avatar-mobile">M</div>
        </div>
      </div>

      {/* Sidebar Panel */}
      <aside className="sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0 1rem 0' }}>
            <div style={{
              width: '85px',
              height: '85px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '2px solid rgba(255, 255, 255, 0.85)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), inset 0 2px 4px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: '6px'
            }}>
              <img
                src="/logo.png"
                alt="SVAT Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'contrast(1.05)'
                }}
              />
            </div>
          </div>

          <nav className="sidebar-menu">
            <li className="sidebar-item">
              <button
                className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => handleTabChange('overview')}
              >
                <LayoutDashboard className="sidebar-icon" />
                Overview
              </button>
            </li>
            <li className="sidebar-item">
              <button
                className={`sidebar-link ${activeTab === 'creator' ? 'active' : ''}`}
                onClick={() => handleTabChange('creator')}
              >
                <FileText className="sidebar-icon" />
                Invoice Creator
              </button>
            </li>
            <li className="sidebar-item">
              <button
                className={`sidebar-link ${activeTab === 'lr' ? 'active' : ''}`}
                onClick={() => handleTabChange('lr')}
              >
                <Truck className="sidebar-icon" />
                LR Creator
              </button>
            </li>
            <li className="sidebar-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 0 }}>
              <button
                className={`sidebar-link ${activeTab.startsWith('quotation') ? 'active' : ''}`}
                onClick={() => setIsQuotationMenuOpen(!isQuotationMenuOpen)}
                style={{ width: '100%', justifyContent: 'space-between', display: 'flex', padding: '0.75rem 1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText className="sidebar-icon" />
                  Quotation
                </div>
                <span style={{ fontSize: '0.75rem' }}>{isQuotationMenuOpen ? '▼' : '▶'}</span>
              </button>

              {isQuotationMenuOpen && (
                <div style={{ paddingLeft: '2.5rem', display: 'flex', flexDirection: 'column', width: '100%', marginTop: '0.25rem' }}>
                  <button
                    className={`sidebar-link ${activeTab === 'quotation-export' ? 'active' : ''}`}
                    onClick={() => handleTabChange('quotation-export')}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', width: '100%', justifyContent: 'flex-start', backgroundColor: 'transparent', color: activeTab === 'quotation-export' ? '#E53935' : 'var(--text-secondary)' }}
                  >
                    Export
                  </button>
                  <button
                    className={`sidebar-link ${activeTab === 'quotation-domestic' ? 'active' : ''}`}
                    onClick={() => handleTabChange('quotation-domestic')}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', width: '100%', justifyContent: 'flex-start', backgroundColor: 'transparent', color: activeTab === 'quotation-domestic' ? '#E53935' : 'var(--text-secondary)' }}
                  >
                    Domestic
                  </button>
                </div>
              )}
            </li>
            <li className="sidebar-item">
              <button
                className={`sidebar-link ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => handleTabChange('history')}
              >
                <History className="sidebar-icon" />
                History Registry
              </button>
            </li>
          </nav>
        </div>

        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-avatar">M</div>
            <div className="user-details">
              <p className="user-name">munik</p>
              <p className="user-role">Billing Manager</p>
            </div>
          </div>
          <button onClick={() => setShowLogoutConfirm(true)} className="btn-logout" title="Sign Out">
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="dashboard-content">
        {/* Quotation Tab */}
        {activeTab.startsWith('quotation') && (
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
            <Quotation type={activeTab === 'quotation-export' ? 'export' : 'domestic'} loadedData={loadedQuotation} triggerToast={triggerToast} />
          </div>
        )}
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="dashboard-header">
              <h2 className="dashboard-title">Dashboard Overview</h2>
            </div>

            <div className="overview-grid">
              {/* Card 1: Total Invoiced */}
              <div className="overview-card">
                <div className="overview-card-info">
                  <p className="overview-card-label">Total Invoiced</p>
                  <p className="overview-card-value">₹{(invoices.reduce((a, b) => a + b.amount, 0)).toLocaleString()}</p>
                </div>
                <div className="overview-card-icon">
                  <IndianRupee size={24} />
                </div>
              </div>

              {/* Card 2: Invoices Count */}
              <div className="overview-card">
                <div className="overview-card-info">
                  <p className="overview-card-label">Invoices Count</p>
                  <p className="overview-card-value">{invoices.length}</p>
                </div>
                <div className="overview-card-icon">
                  <FileText size={24} />
                </div>
              </div>

              {/* Card 3: Lorry Receipts Count */}
              <div className="overview-card">
                <div className="overview-card-info">
                  <p className="overview-card-label">Lorry Receipts</p>
                  <p className="overview-card-value">{savedLrs.length}</p>
                </div>
                <div className="overview-card-icon">
                  <Truck size={24} />
                </div>
              </div>

              {/* Card 4: Quotations Count */}
              <div className="overview-card">
                <div className="overview-card-info">
                  <p className="overview-card-label">Quotations Count</p>
                  <p className="overview-card-value">{savedQuotations.length}</p>
                </div>
                <div className="overview-card-icon">
                  <FileText size={24} />
                </div>
              </div>
            </div>

            {/* Quick Actions (Rendered Second) */}
            <div className="overview-card" style={{ display: 'block', textAlign: 'left', padding: '2rem', marginBottom: '2.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontWeight: 700, color: 'var(--text-dark)', letterSpacing: '0.5px' }}>Quick Actions</h3>
              <div className="quick-actions-row">
                <button className="btn-primary" onClick={() => { handleClearForm(); setActiveTab('creator'); }}>
                  <Plus size={18} /> Create Invoice
                </button>
                <button className="btn-primary" onClick={() => { setLoadedLr(null); setActiveTab('lr'); }}>
                  <Plus size={18} /> Create Lorry Receipt (LR)
                </button>
                <button className="btn-primary" onClick={() => { setLoadedQuotation(null); setActiveTab('quotation-export'); }}>
                  <Plus size={18} /> Create Quotation
                </button>
                <button className="btn-outline" onClick={() => setActiveTab('history')}>
                  <History size={18} /> View History
                </button>
              </div>
            </div>

            {/* Unique Interactive Glassy Charts (Rendered Last) */}
            <div className="dashboard-charts-grid">
              {/* Chart 1: Revenue Trends */}
              <div className="overview-card" style={{ flexDirection: 'column', alignItems: 'stretch', padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)' }}>Revenue Trend</h3>
                </div>
                <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                  <svg viewBox="0 0 500 220" width="100%" height="100%">
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Gridlines */}
                    <line x1="40" y1="30" x2="480" y2="30" stroke="rgba(0,0,0,0.04)" strokeDasharray="3,3" />
                    <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(0,0,0,0.04)" strokeDasharray="3,3" />
                    <line x1="40" y1="130" x2="480" y2="130" stroke="rgba(0,0,0,0.04)" strokeDasharray="3,3" />
                    <line x1="40" y1="180" x2="480" y2="180" stroke="rgba(0,0,0,0.06)" />

                    {/* Area Path */}
                    {areaPathD && <path d={areaPathD} fill="url(#areaGradient)" />}

                    {/* Line Path */}
                    {linePathD && <path d={linePathD} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />}

                    {/* Glowing Path Points */}
                    {chartDataPoints.map((pt, idx) => (
                      <g key={idx}>
                        <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke="var(--primary)" strokeWidth="2.5" />
                        <title>{`Amount: ₹${pt.amount.toLocaleString()}`}</title>
                      </g>
                    ))}

                    {/* Axis Labels */}
                    {chartDataPoints.map((pt, idx) => (
                      <text key={idx} x={pt.x} y="200" fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontWeight="600">
                        {pt.label}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Chart 2: Cargo Distribution */}
              <div className="overview-card" style={{ flexDirection: 'column', alignItems: 'stretch', padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1.5rem', textAlign: 'left' }}>Database Split</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '1rem', height: '220px' }}>
                  <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                    <svg width="100%" height="100%" viewBox="0 0 120 120">
                      {/* Background track circle */}
                      <circle cx="60" cy="60" r="50" fill="transparent" stroke="rgba(0,0,0,0.03)" strokeWidth="12" />

                      {/* Segments */}
                      {donutSegments.map((segment, idx) => (
                        segment.pct > 0 && (
                          <circle
                            key={idx}
                            cx="60"
                            cy="60"
                            r="50"
                            fill="transparent"
                            stroke={segment.color}
                            strokeWidth="12"
                            strokeDasharray={segment.dasharray}
                            strokeDashoffset={segment.offset}
                            strokeLinecap="round"
                            transform="rotate(-90 60 60)"
                          />
                        )
                      ))}
                    </svg>
                    {/* Center percentage indicator */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', fontWeight: 600 }}>Total</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: '1' }}>
                        {invoices.length + savedLrs.length + savedQuotations.length}
                      </span>
                    </div>
                  </div>

                  {/* Legend list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', minWidth: '100px' }}>
                    {donutSegments.map((segment, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: segment.color, display: 'inline-block' }}></span>
                        <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
                          {segment.label} ({segment.pct}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Creator Tab */}
        {activeTab === 'creator' && (
          <div>
            <div className="dashboard-header">
              <h2 className="dashboard-title">Create / Edit Invoice</h2>
            </div>

            <div className="invoice-workspace">
              {/* Creator Form */}
              <div className="invoice-form-container">

                {/* Company Header (Fully Editable) */}
                <h4 className="form-section-title">Billing Entity Details (Seller)</h4>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Address</label>
                  <textarea
                    rows={2}
                    className="form-input"
                    value={formData.companyAddress}
                    onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">GSTIN / UIN</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.companyGst}
                      onChange={(e) => handleInputChange('companyGst', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State & Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.companyState}
                      onChange={(e) => handleInputChange('companyState', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Website</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.companyWebsite}
                      onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">E-Mail</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.companyEmail}
                      onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                    />
                  </div>
                </div>

                {/* Consignee */}
                <h4 className="form-section-title">Consignee (Buyer / Bill To)</h4>
                <div className="form-group">
                  <label className="form-label">Consignee Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.consigneeName}
                    onChange={(e) => handleInputChange('consigneeName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Consignee Address</label>
                  <textarea
                    rows={2}
                    className="form-input"
                    value={formData.consigneeAddress}
                    onChange={(e) => handleInputChange('consigneeAddress', e.target.value)}
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">GSTIN / UIN</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.consigneeGst}
                      onChange={(e) => handleInputChange('consigneeGst', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State & Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.consigneeState}
                      onChange={(e) => handleInputChange('consigneeState', e.target.value)}
                    />
                  </div>
                </div>

                {/* Debit Note Details */}
                <h4 className="form-section-title">Invoice / Document Details</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Debit Note No / Invoice No</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.debitNoteNo}
                      onChange={(e) => handleInputChange('debitNoteNo', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dated</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Original Invoice No</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.originalInvoiceNo}
                      onChange={(e) => handleInputChange('originalInvoiceNo', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original Invoice Date</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.originalInvoiceDate}
                      onChange={(e) => handleInputChange('originalInvoiceDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Other References</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.otherRefs}
                    onChange={(e) => handleInputChange('otherRefs', e.target.value)}
                  />
                </div>

                {/* Tax Setup */}
                <h4 className="form-section-title">GST settings</h4>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">GST Percentage (%)</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    placeholder="e.g. 10"
                    value={formData.gstPercentage}
                    onChange={(e) => handleInputChange('gstPercentage', e.target.value)}
                  />
                </div>

                {/* Transport Cargo */}
                <h4 className="form-section-title">Transport & Shipment Details</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Vessel / Flight No</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.vesselFlightNo}
                      onChange={(e) => handleInputChange('vesselFlightNo', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Place of Receipt by Shipper</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.placeOfReceipt}
                      onChange={(e) => handleInputChange('placeOfReceipt', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">City/Port of Loading</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.portOfLoading}
                      onChange={(e) => handleInputChange('portOfLoading', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City/Port of Discharge</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.portOfDischarge}
                      onChange={(e) => handleInputChange('portOfDischarge', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">No of CTNS</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.ctns}
                      onChange={(e) => handleInputChange('ctns', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CBM Volume</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.cbm}
                      onChange={(e) => handleInputChange('cbm', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                    />
                  </div>
                </div>

                {/* Dynamic Table Particulars */}
                <h4 className="form-section-title">Billing Items Table</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Provide Qty & Rate to multiply, or type a manual amount directly in the "Amount" field.
                </p>
                <table className="items-form-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>Particulars</th>
                      <th style={{ width: '12%' }}>Qty</th>
                      <th style={{ width: '15%' }}>Rate</th>
                      <th style={{ width: '13%' }}>Per</th>
                      <th style={{ width: '15%' }}>Amount</th>
                      <th style={{ width: '5%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ position: 'relative' }}>
                          <textarea
                            rows={1}
                            className="form-input"
                            style={{ width: '100%', resize: 'vertical' }}
                            value={item.particulars}
                            onChange={(e) => {
                              handleItemChange(idx, 'particulars', e.target.value);
                              setActiveRowIdx(idx);
                            }}
                            onFocus={() => setActiveRowIdx(idx)}
                            placeholder="Particulars"
                          />
                          {activeRowIdx === idx && (
                            <SuggestionsDropdown
                              query={item.particulars}
                              list={suggestions}
                              onSelect={(val) => {
                                handleItemChange(idx, 'particulars', val);
                                setActiveRowIdx(null);
                              }}
                              onClose={() => setActiveRowIdx(null)}
                            />
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-input"
                            style={{ width: '100%' }}
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            placeholder="Qty"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-input"
                            style={{ width: '100%' }}
                            value={item.rate}
                            onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                            placeholder="Rate"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-input"
                            style={{ width: '100%' }}
                            value={item.per}
                            onChange={(e) => handleItemChange(idx, 'per', e.target.value)}
                            placeholder="per"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-input"
                            style={{ width: '100%' }}
                            value={item.amount}
                            onChange={(e) => handleItemChange(idx, 'amount', e.target.value)}
                            placeholder="Amount"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-icon-danger"
                            onClick={() => removeItemRow(idx)}
                            disabled={formData.items.length <= 1}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" className="btn-add-item" onClick={addItemRow}>
                  <Plus size={16} /> Add Charge Row
                </button>

                {/* Bank Details (Fully Editable) */}
                <h4 className="form-section-title">Bank Accounts Info</h4>
                <div className="form-group">
                  <label className="form-label">A/c Holder Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.bankHolderName}
                    onChange={(e) => handleInputChange('bankHolderName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bank Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Account No</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.bankAccount}
                      onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Branch & IFSC</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.bankBranch}
                      onChange={(e) => handleInputChange('bankBranch', e.target.value)}
                    />
                  </div>
                </div>

                {/* Signatory (Fully Editable) */}
                <h4 className="form-section-title">Signatory Details</h4>
                <div className="form-group">
                  <label className="form-label">Authorised Signatory Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.signatoryName}
                    onChange={(e) => handleInputChange('signatoryName', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Amount Chargeable in Words (Override)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Leave empty to calculate automatically"
                    value={formData.wordsOverride}
                    onChange={(e) => handleInputChange('wordsOverride', e.target.value)}
                  />
                </div>

                {/* Bottom Actions Row inside Form */}
                <div className="form-actions-row">
                  <button className="btn-outline" style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: '#EF4444', borderColor: '#EF4444' }} onClick={handleClearForm}>
                    <Trash2 size={20} /> Clear Form
                  </button>
                  <button className="btn-outline" style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={handleSaveInvoice}>
                    <Save size={20} /> Save Invoice
                  </button>
                  <button className="btn-primary" style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={handleDownloadPDF}>
                    <Printer size={20} /> Download PDF
                  </button>
                </div>
              </div> {/* End of invoice-form-container */}

              {/* LIVE PREVIEW COLUMN (Visible on screen, responsive and scales automatically on mobile) */}
              <div className="invoice-preview-container" ref={previewContainerRef} style={{ width: '100%', overflowX: 'hidden', overflowY: 'auto' }}>
                <div id="invoice-scale-wrapper" style={{ transform: `scale(${previewScale})`, transformOrigin: 'top left', transition: 'transform 0.2s', width: '794px', height: `${cardHeight * previewScale}px` }}>
                  {/* Printable Invoice Page (Restructured Grid matching the first image layout exactly) */}
                  <div className="invoice-preview-card" ref={cardRef} style={{ padding: '2rem', backgroundColor: '#FFFFFF', color: '#000000', width: '794px', boxSizing: 'border-box' }}>
                    <div className="bill-header" style={{
                      border: '1.5px solid #000000',
                      borderBottom: 'none',
                      textAlign: 'center',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      fontSize: '1.1rem',
                      padding: '0.4rem'
                    }}>
                      {billTitle}
                    </div>

                    {/* Top Metadata Grid: divided into Left Half (Seller, Buyer) & Right Half (Note dates, cargo specs) */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1.1fr 1fr',
                      border: '1.5px solid #000000',
                      borderBottom: 'none'
                    }}>
                      {/* Left Column (Seller Info & Buyer Info) */}
                      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1.5px solid #000000' }}>
                        {/* Seller block */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '110px 1fr',
                          alignItems: 'center',
                          padding: '8px',
                          borderBottom: '1.5px solid #000000'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <SVATLogo />
                            <div style={{ fontSize: '0.52rem', fontWeight: '900', color: '#000000', marginTop: '4px', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1 }}>
                              Container Supplying Agency
                            </div>
                          </div>
                          <div style={{ paddingLeft: '10px', textAlign: 'left' }}>
                            <div style={{ fontSize: '1.18rem', fontWeight: '800', color: '#0F6236', lineHeight: 1.1 }}>
                              {formData.companyName}
                            </div>
                            <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#A82C2C', textTransform: 'uppercase', marginTop: '3px', letterSpacing: '0.5px' }}>Export cargo movers</div>
                            <div style={{ fontSize: '0.68rem', marginTop: '3px', color: '#000000', lineHeight: 1.3 }}>
                              {formData.companyAddress}<br />
                              <strong>GSTIN/UIN:</strong> {formData.companyGst} | <strong>State Name:</strong> {formData.companyState}<br />
                              <strong>Website:</strong> {formData.companyWebsite} | <strong>E-Mail:</strong> {formData.companyEmail}<br />
                              <strong style={{ display: 'block', marginTop: '2px', color: '#1E293B', fontSize: '0.62rem' }}>ISO 9001:2015 Certified transport company</strong>
                            </div>
                          </div>
                        </div>

                        {/* Buyer block */}
                        <div style={{ padding: '8px', textAlign: 'left', flexGrow: 1, fontSize: '0.7rem', lineHeight: 1.4 }}>
                          <div style={{ fontWeight: '700', textTransform: 'uppercase', textDecoration: 'underline', marginBottom: '2px' }}>Buyer (Bill to)</div>
                          {formData.consigneeName && <div style={{ fontWeight: '900', fontSize: '0.82rem', color: '#000000', marginBottom: '2px' }}>{formData.consigneeName}</div>}
                          {formData.consigneeAddress && <div>{formData.consigneeAddress}</div>}
                          {(formData.consigneeGst || formData.consigneeState) && (
                            <div style={{ marginTop: '2px' }}>
                              {formData.consigneeGst && <span><strong>GSTIN/UIN:</strong> {formData.consigneeGst}</span>}
                              {formData.consigneeGst && formData.consigneeState ? ' | ' : ''}
                              {formData.consigneeState && <span><strong>State Name:</strong> {formData.consigneeState}</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column (Document specifications) */}
                      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.7rem', textAlign: 'left' }}>
                        {/* Row 1 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', borderBottom: '1.5px solid #000000', minHeight: '38px' }}>
                          <div style={{ borderRight: '1.5px solid #000000', padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>Debit Note No.</span>
                            <strong style={{ fontSize: '0.75rem' }}>{formData.debitNoteNo}</strong>
                          </div>
                          <div style={{ padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>Dated</span>
                            <strong style={{ fontSize: '0.75rem' }}>{formData.date}</strong>
                          </div>
                        </div>

                        {/* Row 2 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', borderBottom: '1.5px solid #000000', minHeight: '38px' }}>
                          <div style={{ borderRight: '1.5px solid #000000', padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>Original Invoice No. & Date.</span>
                            <strong>{formData.originalInvoiceNo || ''} {formData.originalInvoiceDate ? `dt. ${formData.originalInvoiceDate}` : ''}</strong>
                          </div>
                          <div style={{ padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>Other References</span>
                            <strong>{formData.otherRefs || ''}</strong>
                          </div>
                        </div>

                        {/* Row 3 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', borderBottom: '1.5px solid #000000', minHeight: '38px' }}>
                          <div style={{ borderRight: '1.5px solid #000000', padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>Vessel/Flight No.</span>
                            <strong style={{ fontSize: '0.75rem' }}>{formData.vesselFlightNo}</strong>
                          </div>
                          <div style={{ padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>Place of receipt by shipper:</span>
                            <strong>{formData.placeOfReceipt}</strong>
                          </div>
                        </div>

                        {/* Row 4 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', borderBottom: '1.5px solid #000000', minHeight: '38px' }}>
                          <div style={{ borderRight: '1.5px solid #000000', padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>City/Port of Loading</span>
                            <strong>{formData.portOfLoading}</strong>
                          </div>
                          <div style={{ padding: '4px' }}>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#555' }}>City/Port of Discharge</span>
                            <strong>{formData.portOfDischarge}</strong>
                          </div>
                        </div>

                        {/* Row 5 (Cargo dimensions) */}
                        <div style={{ padding: '8px', lineHeight: 1.4, flexGrow: 1 }}>
                          {formData.ctns && <span><strong>NO OF CTNS – </strong> {formData.ctns}<br /></span>}
                          {formData.cbm && <span><strong>CBM – </strong> {formData.cbm}<br /></span>}
                          {formData.weight && <span><strong>WEIGHT – </strong> {formData.weight}<br /></span>}
                        </div>
                      </div>
                    </div>

                    {/* Main Grid Table */}
                    <div className="bill-table-container" style={{ border: '1.5px solid #000000' }}>
                      <table className="bill-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
                        <thead>
                          <tr>
                            <th style={{ width: '8%', textAlign: 'center', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', padding: '4px' }}>Sl No.</th>
                            <th style={{ width: '45%', textAlign: 'center', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', padding: '4px' }}>Particulars</th>
                            <th style={{ width: '12%', textAlign: 'center', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', padding: '4px' }}>Quantity</th>
                            <th style={{ width: '15%', textAlign: 'center', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', padding: '4px' }}>Rate</th>
                            <th style={{ width: '10%', textAlign: 'center', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', padding: '4px' }}>per</th>
                            <th style={{ width: '10%', textAlign: 'center', borderBottom: '1.5px solid #000000', padding: '4px' }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.items.map((item, idx) => {
                            const cleanAmtStr = (item.amount || '').toString().replace(/[^0-9.]/g, '');
                            const cleanQtyStr = (item.quantity || '').toString().replace(/[^0-9.]/g, '');
                            const cleanRateStr = (item.rate || '').toString().replace(/[^0-9.]/g, '');

                            const hasAmt = cleanAmtStr !== '' || (cleanQtyStr !== '' && cleanRateStr !== '');
                            const amt = hasAmt
                              ? (cleanAmtStr !== ''
                                ? (parseFloat(cleanAmtStr) || 0)
                                : (parseFloat(cleanQtyStr) || 0) * (parseFloat(cleanRateStr) || 0))
                              : null;

                            const qtyVal = cleanQtyStr !== '' ? parseFloat(cleanQtyStr) : null;
                            const rateVal = cleanRateStr !== '' ? parseFloat(cleanRateStr) : null;
                            const amtStr = amt !== null ? amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';

                            return (
                              <tr key={idx} className="bill-table-row">
                                <td style={{ textAlign: 'center', borderRight: '1.5px solid #000000', padding: '6px' }}>{idx + 1}</td>
                                <td style={{ whiteSpace: 'pre-line', borderRight: '1.5px solid #000000', padding: '6px', textAlign: 'left' }}>
                                  <strong style={{ display: 'block', fontSize: '0.75rem' }}>{item.particulars}</strong>
                                </td>
                                <td style={{ textAlign: 'right', borderRight: '1.5px solid #000000', padding: '6px' }}>{qtyVal !== null ? qtyVal : ''}</td>
                                <td style={{ textAlign: 'right', borderRight: '1.5px solid #000000', padding: '6px' }}>{rateVal !== null ? rateVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td>
                                <td style={{ borderRight: '1.5px solid #000000', padding: '6px', textAlign: 'center' }}>{item.per || ''}</td>
                                <td style={{ textAlign: 'right', fontWeight: 800, padding: '6px' }}>{amtStr}</td>
                              </tr>
                            );
                          })}

                          {/* Extra padding rows to keep height scaled like standard A4 template */}
                          {Array.from({ length: Math.max(0, 6 - formData.items.length) }).map((_, idx) => (
                            <tr key={`empty-${idx}`} className="bill-table-row" style={{ height: '32px' }}>
                              <td style={{ borderRight: '1.5px solid #000000' }}></td>
                              <td style={{ borderRight: '1.5px solid #000000' }}></td>
                              <td style={{ borderRight: '1.5px solid #000000' }}></td>
                              <td style={{ borderRight: '1.5px solid #000000' }}></td>
                              <td style={{ borderRight: '1.5px solid #000000' }}></td>
                              <td></td>
                            </tr>
                          ))}

                          {/* Sub Total row (Always shown) */}
                          <tr style={{ borderTop: '1.5px solid #000000', fontWeight: 'bold' }}>
                            <td style={{ borderRight: '1.5px solid #000000', padding: '4px' }}></td>
                            <td colSpan={4} style={{ borderRight: '1.5px solid #000000', textAlign: 'right', padding: '4px' }}>Sub Total</td>
                            <td style={{ textAlign: 'right', padding: '4px' }}>{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          </tr>

                          {/* CGST row */}
                          {cgstAmount > 0 && (
                            <tr style={{ fontWeight: 'bold' }}>
                              <td style={{ borderRight: '1.5px solid #000000', padding: '4px' }}></td>
                              <td colSpan={4} style={{ borderRight: '1.5px solid #000000', textAlign: 'right', padding: '4px' }}>
                                CGST ( {displayCgstRate ? `${displayCgstRate} %` : '        %'} )
                              </td>
                              <td style={{ textAlign: 'right', padding: '4px' }}>{cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          )}

                          {/* SGST row */}
                          {sgstAmount > 0 && (
                            <tr style={{ fontWeight: 'bold' }}>
                              <td style={{ borderRight: '1.5px solid #000000', padding: '4px' }}></td>
                              <td colSpan={4} style={{ borderRight: '1.5px solid #000000', textAlign: 'right', padding: '4px' }}>
                                SGST ( {displaySgstRate ? `${displaySgstRate} %` : '        %'} )
                              </td>
                              <td style={{ textAlign: 'right', padding: '4px' }}>{sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          )}

                          {/* IGST row */}
                          {igstAmount > 0 && (
                            <tr style={{ fontWeight: 'bold' }}>
                              <td style={{ borderRight: '1.5px solid #000000', padding: '4px' }}></td>
                              <td colSpan={4} style={{ borderRight: '1.5px solid #000000', textAlign: 'right', padding: '4px' }}>
                                IGST ( 0 % )
                              </td>
                              <td style={{ textAlign: 'right', padding: '4px' }}>{igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          )}



                          {/* Grand Total Row */}
                          <tr style={{ borderTop: '1.5px solid #000000', fontWeight: '800', backgroundColor: '#E2E8F0' }}>
                            <td style={{ borderRight: '1.5px solid #000000', padding: '5px' }}></td>
                            <td colSpan={4} style={{ borderRight: '1.5px solid #000000', textAlign: 'right', padding: '5px', fontWeight: '800' }}>
                              Grand Total
                            </td>
                            <td style={{ textAlign: 'right', padding: '5px', fontWeight: '800' }}>
                              ₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* GST RCM Status Bar */}
                    <div style={{
                      border: '1.5px solid #000000',
                      borderTop: 'none',
                      padding: '5px 8px',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      textAlign: 'left',
                      backgroundColor: '#FFFFFF',
                      lineHeight: 1.3
                    }}>
                      <span>Whether GST is payable on Reverse Charge basis (RCM): <strong>{
                        (parseFloat(formData.gstPercentage) || 0) === 0 ? 'Exempted' : 'No'
                      }</strong></span>
                    </div>

                    {/* Bottom Section: Words block on left, Bank + Signatory on right */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '53% 47%',
                      border: '1.5px solid #000000',
                      borderTop: 'none',
                      fontSize: '0.7rem',
                      textAlign: 'left'
                    }}>
                      {/* Left Column: Amount in Words */}
                      <div style={{
                        padding: '8px',
                        borderRight: '1.5px solid #000000',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        minHeight: '170px'
                      }}>
                        <div style={{ marginBottom: '4px' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.72rem' }}>Amount Chargeable (in words):</span>
                          <span style={{ float: 'right', fontStyle: 'italic', fontWeight: 'bold', fontSize: '0.62rem' }}>E. & O.E</span>
                        </div>
                        <strong style={{ fontSize: '0.78rem', textTransform: 'uppercase', lineHeight: '1.3' }}>
                          {amountInWords}
                        </strong>
                      </div>

                      {/* Right Column: Bank details (top) & Signatory (bottom) */}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Bank Details */}
                        <div style={{ padding: '8px', flexGrow: 1, lineHeight: '1.4' }}>
                          <div style={{ fontWeight: '700', textDecoration: 'underline', marginBottom: '4px' }}>Company's Bank Details:</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr' }}>
                            <span>A/c Holder's Name</span>
                            <strong>: {formData.bankHolderName}</strong>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr' }}>
                            <span>Bank Name</span>
                            <strong>: {formData.bankName}</strong>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr' }}>
                            <span>A/c No.</span>
                            <strong>: {formData.bankAccount}</strong>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr' }}>
                            <span>Branch & IFS Code</span>
                            <strong>: {formData.bankBranch}</strong>
                          </div>
                        </div>

                        {/* Signatory Block */}
                        <div style={{
                          borderTop: '1.5px solid #000000',
                          padding: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: '90px'
                        }}>
                          <div style={{ fontWeight: '700', textAlign: 'center', textTransform: 'uppercase' }}>
                            for {formData.companyName}
                          </div>
                          <div style={{ textAlign: 'right', marginTop: 'auto' }}>
                            <strong style={{ display: 'block', fontSize: '0.72rem', textAlign: 'right' }}>({formData.signatoryName})</strong>
                            <span style={{ fontSize: '0.62rem', fontWeight: 'bold', display: 'block', color: '#444', textAlign: 'right', marginTop: '2px' }}>Authorised Signatory</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bill-disclaimer" style={{ textAlign: 'center', fontSize: '0.62rem', marginTop: '4px', fontStyle: 'italic' }}>
                      This is a Computer Generated Document
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LR Creator Tab */}
        {activeTab === 'lr' && (
          <LrCreator loadedLr={loadedLr} triggerToast={triggerToast} />
        )}

        {/* Unified History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="dashboard-header">
              <h2 className="dashboard-title">History Registry</h2>
            </div>

            {/* History Sub-tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <button
                onClick={() => setHistorySubTab('dn')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: historySubTab === 'dn' ? '#E53935' : 'transparent',
                  color: historySubTab === 'dn' ? '#fff' : 'var(--text-secondary)',
                  border: historySubTab === 'dn' ? 'none' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}
              >
                Debit Notes (DN)
              </button>
              <button
                onClick={() => setHistorySubTab('lr')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: historySubTab === 'lr' ? '#E53935' : 'transparent',
                  color: historySubTab === 'lr' ? '#fff' : 'var(--text-secondary)',
                  border: historySubTab === 'lr' ? 'none' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}
              >
                Lorry Receipts (LR)
              </button>
              <button
                onClick={() => setHistorySubTab('quote')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: historySubTab === 'quote' ? '#E53935' : 'transparent',
                  color: historySubTab === 'quote' ? '#fff' : 'var(--text-secondary)',
                  border: historySubTab === 'quote' ? 'none' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}
              >
                Quotations
              </button>
            </div>

            {/* Invoices (Debit Notes) List */}
            {historySubTab === 'dn' && (
              <div className="history-list">
                {invoices.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No Debit Notes (Invoices) found.</p>
                ) : (
                  invoices.map((inv) => (
                    <div key={inv.id} className="history-item">
                      <div className="history-left">
                        <p className="history-code">{inv.id}</p>
                        <p className="history-name">{inv.consignee || inv.consigneeName}</p>
                        <p className="history-date">Generated: {inv.date}</p>
                      </div>
                      <div className="history-right">
                        <span className={`badge-status ${inv.status || 'pending'}`}>{inv.status || 'pending'}</span>
                        <span className="history-amount">₹{(inv.amount || 0).toLocaleString()}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-outline" onClick={() => handleLoadInvoice(inv)}>
                            Edit / View
                          </button>
                          <button
                            className="btn-outline"
                            style={{ borderColor: '#EF4444', color: '#EF4444', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => setDeleteConfirm({ show: true, type: 'dn', id: inv.id })}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Lorry Receipts (LR) List */}
            {historySubTab === 'lr' && (
              <div className="history-list">
                {savedLrs.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No Lorry Receipts found.</p>
                ) : (
                  savedLrs.map((lr) => (
                    <div key={lr.id} className="history-item">
                      <div className="history-left">
                        <p className="history-code">{lr.id}</p>
                        <p className="history-name">From: {lr.consignor || 'Unknown'} | To: {lr.consignee || 'Unknown'}</p>
                        <p className="history-date">Truck: {lr.truckNo || 'N/A'} | Date: {lr.date}</p>
                      </div>
                      <div className="history-right">
                        <span className="history-amount">₹{(lr.amount || 0).toLocaleString()}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-outline" onClick={() => {
                            setLoadedLr(lr);
                            setActiveTab('lr');
                          }}>
                            Edit / View
                          </button>
                          <button
                            className="btn-outline"
                            style={{ borderColor: '#EF4444', color: '#EF4444', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => setDeleteConfirm({ show: true, type: 'lr', id: lr.id })}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Quotations List */}
            {historySubTab === 'quote' && (
              <div className="history-list">
                {savedQuotations.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No Quotations found.</p>
                ) : (
                  savedQuotations.map((quote) => (
                    <div key={quote.id} className="history-item">
                      <div className="history-left">
                        <p className="history-code">{quote.id}</p>
                        <p className="history-name">Route: {quote.from || 'Tirupur'} to {quote.to}</p>
                        <p className="history-date">Type: {quote.type === 'export' ? 'Export' : 'Domestic'} | Date: {quote.date}</p>
                      </div>
                      <div className="history-right">
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-outline" onClick={() => {
                            setLoadedQuotation(quote);
                            setActiveTab(quote.type === 'export' ? 'quotation-export' : 'quotation-domestic');
                          }}>
                            Edit / View
                          </button>
                          <button
                            className="btn-outline"
                            style={{ borderColor: '#EF4444', color: '#EF4444', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => setDeleteConfirm({ show: true, type: 'quote', id: quote.id })}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav">
        <button
          className={`mobile-nav-link ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          <LayoutDashboard className="mobile-nav-icon" />
          <span>Overview</span>
        </button>
        <button
          className={`mobile-nav-link ${activeTab === 'creator' ? 'active' : ''}`}
          onClick={() => handleTabChange('creator')}
        >
          <Plus className="mobile-nav-icon" />
          <span>Create</span>
        </button>
        <button
          className={`mobile-nav-link ${activeTab === 'lr' ? 'active' : ''}`}
          onClick={() => handleTabChange('lr')}
        >
          <Truck className="mobile-nav-icon" />
          <span>LR</span>
        </button>
        <button
          className={`mobile-nav-link ${activeTab.startsWith('quotation') ? 'active' : ''}`}
          onClick={() => handleTabChange('quotation-export')}
        >
          <FileText className="mobile-nav-icon" />
          <span>Quote</span>
        </button>
        <button
          className={`mobile-nav-link ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => handleTabChange('history')}
        >
          <History className="mobile-nav-icon" />
          <span>History</span>
        </button>
        <button className="mobile-nav-link logout" onClick={() => setShowLogoutConfirm(true)}>
          <LogOut className="mobile-nav-icon" />
          <span>Logout</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          backgroundColor: toast.type === 'success' ? '#22C55E' : '#EF4444',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 2000,
          fontWeight: 'bold',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none'
        }}>
          <span>{toast.type === 'success' ? '✓' : '✗'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '28px 24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.08)', color: 'var(--text-dark)', width: '340px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)' }}>Delete Item</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Are you sure you want to delete this {deleteConfirm.type === 'dn' ? 'Invoice' : deleteConfirm.type === 'lr' ? 'Lorry Receipt' : 'Quotation'}?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }} onClick={() => setDeleteConfirm({ show: false, type: '', id: null })}>Cancel</button>
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '8px', fontSize: '0.85rem', backgroundColor: '#EF4444', borderColor: '#EF4444', color: '#fff' }}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '28px 24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.08)', color: 'var(--text-dark)', width: '320px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)' }}>Logout</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.95rem', color: 'var(--text-muted)' }}>Are you sure you want to log out?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }} onClick={() => setShowLogoutConfirm(false)}>No</button>
              <button className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }} onClick={onLogout}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
