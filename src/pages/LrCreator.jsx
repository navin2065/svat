import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Printer, Save, Truck, Info } from 'lucide-react';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

// Suggestions Dropdown component with prefix-first sorting
const SuggestionsDropdown = ({ query, list, onSelect }) => {
  const lowerQuery = (query || '').toLowerCase();
  const filtered = list.filter(val => 
    val.toLowerCase().includes(lowerQuery) && 
    val.toLowerCase() !== lowerQuery
  ).sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    const aStarts = aLower.startsWith(lowerQuery);
    const bStarts = bLower.startsWith(lowerQuery);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return a.localeCompare(b);
  });

  if (filtered.length === 0) return null;

  return (
    <ul className="suggestions-dropdown-list" style={{
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      maxHeight: '180px',
      overflowY: 'auto',
      zIndex: 100,
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
            e.preventDefault();
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

const AutocompleteInput = ({
  label,
  type = 'text',
  className = 'form-input',
  placeholder,
  maxLength,
  value,
  onChange,
  suggestions,
  onSelectSuggestion,
  style = {}
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="form-group" style={style}>
      {label && <label className="form-label">{label}</label>}
      <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
        <input
          type={type}
          className={className}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && (
          <SuggestionsDropdown
            query={value}
            list={suggestions}
            onSelect={(val) => {
              onSelectSuggestion(val);
              setShowSuggestions(false);
            }}
            onClose={() => setShowSuggestions(false)}
          />
        )}
      </div>
    </div>
  );
};

const AutocompleteTextarea = ({
  label,
  className = 'form-input',
  placeholder,
  rows = 2,
  value,
  onChange,
  suggestions,
  onSelectSuggestion,
  style = {}
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="form-group" style={style}>
      {label && <label className="form-label">{label}</label>}
      <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
        <textarea
          rows={rows}
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && (
          <SuggestionsDropdown
            query={value}
            list={suggestions}
            onSelect={(val) => {
              onSelectSuggestion(val);
              setShowSuggestions(false);
            }}
            onClose={() => setShowSuggestions(false)}
          />
        )}
      </div>
    </div>
  );
};

const AutocompleteTableInput = ({
  value,
  onChange,
  suggestions,
  placeholder,
  style = {}
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        className="form-input"
        style={{ width: '100%', padding: '4px', fontSize: '0.8rem', ...style }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && (
        <SuggestionsDropdown
          query={value}
          list={suggestions}
          onSelect={(val) => {
            onChange({ target: { value: val } });
            setShowSuggestions(false);
          }}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

const DEFAULT_LR = {
  lrNo: '',
  date: '',
  from: '',
  to: '',
  truckNo: '',
  paymentMode: 'TOPAY', // TOPAY, PAID, CREDIT
  consignorName: '',
  consignorAddress: '',
  consignorGst: '',
  consigneeName: '',
  consigneeAddress: '',
  consigneeGst: '',
  cargoItems: [
    { noOfPackages: '', goodsDescription: '', actualWeight: '', chargedWeight: '' }
  ],
  consignorCopy: false,
  consigneeCopy: false,
  trackCopy: false,
  ewayBillNo: '',
  privateMarks: '',
  invoiceNo: '',
  valueRs: '',
  charges: {
    freightPerKgCft: '',
    freightAmount: '',
    hamali: '',
    doorPickup: '',
    doorDelivery: '',
    statistical: '',
    aoc: '',
    foc: '',
    others: '',
    gstRate: '5' // 5%, 12%, 18%, 0%
  },
  companyGstin: '33RSPPS1745J1ZU',
  companyPan: 'RSPPS1745J',
  companyUdyam: 'TN-28-0204870',
  companyIso: 'QTN202604894',
  companyPhone1: '96552 37104',
  companyPhone2: '96552 35088',
  companyEmail: 'vaarahitpt104@gmail.com',
  companyWebsite: 'www.sreevaarahiammantransports.com'
};

const DOTTED_LINE_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzIwJz48cmVjdCB4PScwJyB5PScxOScgd2lkdGg9JzInIGhlaWdodD0nMScgZmlsbD0nIzA4MTAzQScvPjwvc3ZnPg==';
const WHATSAPP_ICON_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9JzExJyBoZWlnaHQ9JzExJz48cGF0aCBmaWxsPScjMDgxMDNBJyBkPSdNMTIuMDEgMi4wMWMtNS41MiAwLTEwIDQuNDgtMTAgMTAgMCAxLjk1LjU2IDMuNzYgMS41MSA1LjI1TDIuMDEgMjJsNC44OS0xLjQ4YzEuNDYuODggMy4xOSAxLjQgNS4wMyAxLjQgNS41MiAwIDEwLTQuNDggMTAtMTBzLTQuNDgtMTAtMTAtMTB6bTUuOCAxNC4xMmMtLjI2Ljc0LTEuNTIgMS40My0yLjEyIDEuNS0uNi4wNy0xLjM5LjItMy45NS0xLjA0LTMuMDktMS40OS01LjA3LTQuNjYtNS4yMy00Ljg4LS4xNS0uMjItMS4yNS0xLjY2LTEuMjUtMy4xNyAwLTEuNTEuNzgtMi4yNSAxLjA1LTIuNTUuMjgtLjMuNi0uMzcuOC0uMzdzLjQuMDEuNTcuMDFjLjE4IDAgLjQyLS4wNy42NS40OS4yMy41Ni43OCAxLjkxLjg1IDIuMDYuMDcuMTUuMTIuMzMuMDIuNTMtLjEuMi0uMTUuMzMtLjMuNS0uMTUuMTgtLjMyLjM5LS40NC41LS4xNS4xNC0uMzEuMjgtLjE0LjU4LjE3LjMgMS41IDIuMTQgMS43NiAyLjQ1LjI3LjMxLjU0LjQuODQuMjYuMy0uMTQuNDgtLjQ4LjctLjcuMTctLjE4LjM1LS4xNS41NS0uMDcuMi4wNyAxLjI1LjU5IDEuNDcuNy4yLjExLjMzLjE3LjM4LjI2LjA1LjEuMDUuNTgtLjIgMS4zMnonLz48L3N2Zz4=';
const PHONE_ICON_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9JzExJyBoZWlnaHQ9JzExJz48cGF0aCBmaWxsPScjMDgxMDNBJyBkPSdNMjAgMTUuNWMtMS4yIDAtMi40LS4yLTMuNi0uNi0uMy0uMS0uNyAwLTEgLjJsLTIuMiAyLjJjLTIuOC0xLjQtNS4xLTMuOC02LjYtNi42bDIuMi0yLjJjLjMtLjMuNC0uNy4yLTEtLjQtMS4yLS42LTIuNC0uNi0zLjYgMC0uNi0uNS0xLTEtMUg0Yy0uNiAwLTEgLjUtMSAxIDAgOS40IDcuNiAxNyAxNyAxNyAuNiAwIDEtLjUgMS0xdi0zLjVjMC0uNS0uNS0xLTEtMXpNMTkgMTJoMmMwLTQuOC0zLjktOC43LTguNy04Ljd2MmMzLjcgMCA2LjcgMyA2LjcgNi43eicvPjwvc3ZnPg==';

export default function LrCreator({ loadedLr = null, triggerToast = null }) {
  const [formData, setFormData] = useState(DEFAULT_LR);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('/')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const [signatureImage, setSignatureImage] = useState(() => {
    return localStorage.getItem('svat_signature_image') || '';
  });

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      if (triggerToast) {
        triggerToast('Image size should be less than 5MB', 'error');
      } else {
        alert('Image size should be less than 5MB');
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setSignatureImage(base64);
      localStorage.setItem('svat_signature_image', base64);
      if (triggerToast) {
        triggerToast('Signature uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSignature = () => {
    setSignatureImage('');
    localStorage.removeItem('svat_signature_image');
    if (triggerToast) {
      triggerToast('Signature removed.');
    }
  };

  useEffect(() => {
    if (loadedLr) {
      const normalized = { ...loadedLr };
      if (normalized.date && normalized.date.includes('/')) {
        const parts = normalized.date.split('/');
        normalized.date = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      setFormData(normalized);
    } else {
      setFormData(DEFAULT_LR);
    }
  }, [loadedLr]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  
  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [cardHeight, setCardHeight] = useState(794);
  const cardRef = useRef(null);

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        // Calculate available width minus some padding
        const availableWidth = previewContainerRef.current.clientWidth - 40; 
        const newScale = availableWidth / 1123;
        setPreviewScale(newScale < 1 ? newScale : 1);
      }
    };
    
    updateScale();
    setTimeout(updateScale, 100); 
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        // Round to avoid subpixel rounding rendering discrepancies
        setCardHeight(Math.round(entry.contentRect.height));
      }
    });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Suggestions history for Goods Description
  const [goodsHistory, setGoodsHistory] = useState(() => {
    const saved = localStorage.getItem('svat_goods_history');
    return saved ? JSON.parse(saved) : [
      "Cotton Box",
      "Yarn Bags",
      "Garments Box",
      "Textile Goods",
      "Machinery Parts",
      "Cotton Yarn",
      "Fabric Rolls",
      "Cone Carton Box"
    ];
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'suggestions', 'goods_history'), (docSnap) => {
      if (docSnap.exists()) {
        const list = docSnap.data().list || [];
        setGoodsHistory(list);
        localStorage.setItem('svat_goods_history', JSON.stringify(list));
      }
    }, (error) => {
      console.error("Firestore suggestions listener error for goodsHistory:", error);
    });
    return () => unsubscribe();
  }, []);

  const [savedLrs, setSavedLrs] = useState(() => {
    return JSON.parse(localStorage.getItem('svat_saved_lrs') || '[]');
  });

  const getFieldSuggestions = (fieldName) => {
    const values = savedLrs.map(lr => {
      if (fieldName.startsWith('charges.')) {
        const subField = fieldName.split('.')[1];
        return lr.charges?.[subField];
      }
      return lr[fieldName];
    }).filter(val => val !== undefined && val !== null && val.toString().trim() !== '');
    
    return Array.from(new Set(values.map(val => val.toString().trim())));
  };

  const getFieldSuggestionsForCargo = (fieldName) => {
    const values = [];
    savedLrs.forEach(lr => {
      if (Array.isArray(lr.cargoItems)) {
        lr.cargoItems.forEach(item => {
          if (item && item[fieldName] !== undefined && item[fieldName] !== null) {
            const trimmed = item[fieldName].toString().trim();
            if (trimmed !== '') {
              values.push(trimmed);
            }
          }
        });
      }
    });
    return Array.from(new Set(values));
  };

  const getCargoSuggestions = () => {
    const values = [];
    savedLrs.forEach(lr => {
      if (Array.isArray(lr.cargoItems)) {
        lr.cargoItems.forEach(item => {
          if (item && item.goodsDescription) {
            const trimmed = item.goodsDescription.trim();
            if (trimmed !== '') {
              values.push(trimmed);
            }
          }
        });
      }
    });
    // Add default goodsHistory values
    goodsHistory.forEach(val => {
      if (val && val.trim() !== '') {
        values.push(val.trim());
      }
    });
    return Array.from(new Set(values));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChargeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      charges: {
        ...prev.charges,
        [field]: value
      }
    }));
  };

  // Calculations
  const getNumericValue = (val) => {
    if (!val) return 0;
    const cleanStr = val.toString().replace(/[^0-9.]/g, '');
    return parseFloat(cleanStr) || 0;
  };

  const getWhatsAppUrl = (phone) => {
    const digits = (phone || '').replace(/[^0-9]/g, '');
    if (digits.length === 10) {
      return `https://wa.me/91${digits}`;
    }
    return `https://wa.me/${digits}`;
  };

  const getTelUrl = (phone) => {
    const digits = (phone || '').replace(/[^0-9]/g, '');
    if (digits.length === 10) {
      return `tel:+91${digits}`;
    }
    return `tel:${digits}`;
  };

  const totalChargedWeight = (formData.cargoItems || []).reduce((sum, item) => sum + getNumericValue(item.chargedWeight), 0);
  const freightAmount = getNumericValue(formData.charges.freightAmount);
  const hamali = getNumericValue(formData.charges.hamali);
  const doorPickup = getNumericValue(formData.charges.doorPickup);
  const doorDelivery = getNumericValue(formData.charges.doorDelivery);
  const statistical = getNumericValue(formData.charges.statistical);
  const aoc = getNumericValue(formData.charges.aoc);
  const foc = getNumericValue(formData.charges.foc);
  const others = getNumericValue(formData.charges.others);
  const gstRate = getNumericValue(formData.charges.gstRate);

  const subtotal = freightAmount + hamali + doorPickup + doorDelivery + statistical + aoc + foc + others;
  const gstAmount = (subtotal * gstRate) / 100;
  const totalAmount = subtotal + gstAmount;

  const handleCargoItemChange = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...(prev.cargoItems || [])];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
      return {
        ...prev,
        cargoItems: newItems
      };
    });
  };

  const addCargoItemRow = () => {
    setFormData(prev => ({
      ...prev,
      cargoItems: [...(prev.cargoItems || []), { noOfPackages: '', goodsDescription: '', actualWeight: '', chargedWeight: '' }]
    }));
  };

  const removeCargoItemRow = (index) => {
    setFormData(prev => {
      const newItems = (prev.cargoItems || []).filter((_, idx) => idx !== index);
      return {
        ...prev,
        cargoItems: newItems.length > 0 ? newItems : [{ noOfPackages: '', goodsDescription: '', actualWeight: '', chargedWeight: '' }]
      };
    });
  };

  const handleClearForm = () => {
    setShowClearConfirm(true);
  };

  const confirmClearForm = () => {
    setFormData(DEFAULT_LR);
    setShowClearConfirm(false);
  };

  const handleSaveLR = () => {
    setShowSaveConfirm(true);
  };

  const confirmSaveLR = async () => {
    // Add current goods description to local storage history list
    const currentGoods = (formData.cargoItems?.[0]?.goodsDescription || '').trim();
    let updatedHistory = [...goodsHistory];
    let historyChanged = false;
    if (currentGoods && !goodsHistory.includes(currentGoods)) {
      updatedHistory.push(currentGoods);
      setGoodsHistory(updatedHistory);
      localStorage.setItem('svat_goods_history', JSON.stringify(updatedHistory));
      historyChanged = true;
    }
    
    // Save the receipt to a list of saved LRs (optional helper log)
    const newLrEntry = {
      ...formData,
      id: formData.lrNo || `LR-${Date.now().toString().slice(-5)}`,
      date: formData.date || new Date().toLocaleDateString('en-IN'),
      consignee: formData.consigneeName,
      consignor: formData.consignorName,
      amount: totalAmount,
      truckNo: formData.truckNo,
      from: formData.from,
      to: formData.to,
      createdAt: Date.now()
    };
    
    try {
      await setDoc(doc(db, 'lorry_receipts', newLrEntry.id), newLrEntry);
      if (triggerToast) {
        triggerToast('LR saved successfully!');
      } else {
        alert('LR saved successfully!');
      }
    } catch (err) {
      console.error("Error saving LR to Firestore:", err);
      // Fallback
      const currentSavedLrs = JSON.parse(localStorage.getItem('svat_saved_lrs') || '[]');
      const index = currentSavedLrs.findIndex(lr => lr.id === newLrEntry.id);
      if (index > -1) {
        currentSavedLrs[index] = newLrEntry;
      } else {
        currentSavedLrs.unshift(newLrEntry);
      }
      localStorage.setItem('svat_saved_lrs', JSON.stringify(currentSavedLrs));
      setSavedLrs(currentSavedLrs);

      if (triggerToast) {
        triggerToast('LR saved locally!');
      } else {
        alert('LR saved locally!');
      }
    }

    if (historyChanged) {
      try {
        await setDoc(doc(db, 'suggestions', 'goods_history'), { list: updatedHistory });
      } catch (err) {
        console.error("Error saving goods suggestions to Firestore:", err);
      }
    }

    setShowSaveConfirm(false);
  };

  const handleDownloadPDF = () => {
    // Save suggestions first
    const currentGoods = (formData.cargoItems?.[0]?.goodsDescription || '').trim();
    if (currentGoods && !goodsHistory.includes(currentGoods)) {
      const updated = [...goodsHistory, currentGoods];
      setGoodsHistory(updated);
      localStorage.setItem('svat_goods_history', JSON.stringify(updated));
    }

    const element = document.getElementById('lr-pdf-pages');
    if (!element) return;

    const filename = `LR_${(formData.lrNo || 'receipt').replace(/\//g, '_')}.pdf`;
    
    const opt = {
      margin:       0,
      filename:     filename,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 3, useCORS: true, logging: false, scrollX: 0, scrollY: 0 },
      jsPDF:        { unit: 'px', format: [1123, 794], orientation: 'landscape' },
      pagebreak:    { mode: 'css' }
    };
    
    const cards = element.querySelectorAll('.lr-preview-card');
    cards.forEach(card => {
      card.style.boxShadow = 'none';
      card.style.marginBottom = '0';
    });
    
    const scaleWrapper = document.getElementById('lr-scale-wrapper');
    if (scaleWrapper) {
      scaleWrapper.style.transform = 'scale(1)';
    }
    
    window.html2pdf().set(opt).from(element).save().then(() => {
      // Restore shadow and margins
      cards.forEach((card, idx) => {
        card.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.5)';
        card.style.marginBottom = idx < cargoChunks.length - 1 ? '20px' : '0';
      });
      if (scaleWrapper) {
        scaleWrapper.style.transform = `scale(${previewScale})`;
      }
    });
  };

  const formatRsPs = (val) => {
    const num = parseFloat(val) || 0;
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getRsPs = (val) => {
    if (val === undefined || val === null || val === '') return { rs: '', ps: '' };
    const num = parseFloat(val);
    if (isNaN(num) || num === 0) return { rs: '', ps: '' };
    const parts = num.toFixed(2).split('.');
    const rsFormatted = parseInt(parts[0]).toLocaleString('en-IN');
    return { rs: rsFormatted, ps: parts[1] };
  };

  const cargoChunks = (() => {
    const arr = formData.cargoItems || [];
    if (arr.length === 0) return [[]];
    const chunks = [];
    let currentChunk = [];
    let currentLines = 0;
    const MAX_LINES_PER_PAGE = 8;
    const CHARS_PER_LINE = 55;
    
    const splitText = (text) => {
      if (!text) return [''];
      const lines = text.split('\n');
      const result = [];
      lines.forEach(line => {
        if (line.trim() === '') {
          result.push('');
          return;
        }
        let currentLine = '';
        const words = line.split(' ');
        words.forEach(w => {
          while (w.length > CHARS_PER_LINE) {
            if (currentLine) {
              result.push(currentLine.trim());
              currentLine = '';
            }
            result.push(w.substring(0, CHARS_PER_LINE));
            w = w.substring(CHARS_PER_LINE);
          }
          if (w) {
            if (currentLine.length + w.length + 1 > CHARS_PER_LINE) {
              result.push(currentLine.trim());
              currentLine = w + ' ';
            } else {
              currentLine += w + ' ';
            }
          }
        });
        if (currentLine) {
          result.push(currentLine.trim());
        }
      });
      return result.length > 0 ? result : [''];
    };

    arr.forEach(item => {
      let descLines = splitText(item.goodsDescription || '');
      let isFirstPiece = true;

      while (descLines.length > 0) {
        const availableLines = MAX_LINES_PER_PAGE - currentLines;
        if (availableLines <= 0) {
          chunks.push(currentChunk);
          currentChunk = [];
          currentLines = 0;
          continue;
        }

        const linesToTake = Math.min(descLines.length, availableLines);
        const takenLines = descLines.splice(0, linesToTake);

        currentChunk.push({
          noOfPackages: isFirstPiece ? item.noOfPackages : '',
          goodsDescription: takenLines.join('\n'),
          actualWeight: isFirstPiece ? item.actualWeight : '',
          chargedWeight: isFirstPiece ? item.chargedWeight : ''
        });

        currentLines += linesToTake;
        isFirstPiece = false;
      }
    });

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }
    return chunks;
  })();

  return (
    <div>
      {/* Styles for LR Creator component to ensure exact replica and colors */}
      <style>{`
        /* Custom scrollbar for suggestions dropdown */
        .suggestions-dropdown-list {
          scrollbar-width: thin;
          scrollbar-color: #f1b400 #262d3d;
        }
        .suggestions-dropdown-list::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .suggestions-dropdown-list::-webkit-scrollbar-track {
          background: #262d3d;
          border-radius: 6px;
        }
        .suggestions-dropdown-list::-webkit-scrollbar-thumb {
          background: #f1b400;
          border-radius: 6px;
        }
        .suggestions-dropdown-list::-webkit-scrollbar-thumb:hover {
          background: #d9a200;
        }

        .lr-workspace {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          align-items: start;
        }

        /* Force form fields to be line-by-line to fit narrow column */
        .invoice-form-container .form-grid-2,
        .invoice-form-container .form-grid-3 {
          display: flex !important;
          flex-direction: column !important;
          gap: 1rem;
        }
        
        .lr-preview-container {
          position: sticky;
          top: 100px;
          max-height: calc(100vh - 120px);
          overflow: auto;
          padding-right: 0.5rem;
          width: 100%;
        }
        
        .lr-preview-card {
          background-color: #FFFFFF;
          color: #08103A !important;
          padding: 24px;
          width: 1123px; /* A4 Landscape Width at 96 DPI */
          height: 794px; /* Strictly fixed A4 landscape height */
          flex-shrink: 0;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          text-align: left;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .lr-preview-card-inner {
          border: 2px solid #08103A;
          width: 100%;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .lr-preview-card * {
          color: #08103A !important;
          box-sizing: border-box;
        }

        .lr-preview-card .bg-dark-text-white {
          background-color: #08103A !important;
          color: #FFFFFF !important;
        }

        .lr-preview-card strong {
          font-weight: 800 !important;
        }
        
        .lr-preview-card th, 
        .lr-preview-card td,
        .lr-preview-card div,
        .lr-preview-card span {
          border-color: #08103A !important;
        }

        .payment-pill-selected {
          border: 1.5px solid #08103A;
          background-color: rgba(8, 16, 58, 0.1);
          font-weight: 900 !important;
          padding: 1px 6px;
          border-radius: 3px;
          font-size: 0.6rem;
        }

        .payment-pill-unselected {
          font-size: 0.55rem;
          opacity: 0.4;
          text-decoration: line-through;
          padding: 1px 4px;
        }
        
        @media (max-width: 1024px) {
          .lr-workspace {
            grid-template-columns: 1fr;
          }
          .lr-preview-container {
            position: static;
            max-height: none;
            overflow-x: auto;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <h2 className="dashboard-title">Create / Edit Lorry Receipt (LR)</h2>
      </div>

      <div className="lr-workspace">
        {/* Left Hand Form Container */}
        <div className="invoice-form-container">
          
          {/* Company Header Details */}
          <h4 className="form-section-title">Company Header Details</h4>
          <div className="form-grid-2">
            <AutocompleteInput
              label="GSTIN"
              maxLength={20}
              value={formData.companyGstin}
              onChange={(e) => handleInputChange('companyGstin', e.target.value)}
              suggestions={getFieldSuggestions('companyGstin')}
              onSelectSuggestion={(val) => handleInputChange('companyGstin', val)}
            />
            <AutocompleteInput
              label="PAN"
              maxLength={10}
              value={formData.companyPan}
              onChange={(e) => handleInputChange('companyPan', e.target.value)}
              suggestions={getFieldSuggestions('companyPan')}
              onSelectSuggestion={(val) => handleInputChange('companyPan', val)}
            />
            <AutocompleteInput
              label="UDYAM"
              maxLength={25}
              value={formData.companyUdyam}
              onChange={(e) => handleInputChange('companyUdyam', e.target.value)}
              suggestions={getFieldSuggestions('companyUdyam')}
              onSelectSuggestion={(val) => handleInputChange('companyUdyam', val)}
            />
            <AutocompleteInput
              label="ISO Certificate"
              maxLength={20}
              value={formData.companyIso}
              onChange={(e) => handleInputChange('companyIso', e.target.value)}
              suggestions={getFieldSuggestions('companyIso')}
              onSelectSuggestion={(val) => handleInputChange('companyIso', val)}
            />
            <AutocompleteInput
              label="WhatsApp Number"
              maxLength={15}
              value={formData.companyPhone1}
              onChange={(e) => handleInputChange('companyPhone1', e.target.value)}
              suggestions={getFieldSuggestions('companyPhone1')}
              onSelectSuggestion={(val) => handleInputChange('companyPhone1', val)}
            />
            <AutocompleteInput
              label="Phone Number"
              maxLength={15}
              value={formData.companyPhone2}
              onChange={(e) => handleInputChange('companyPhone2', e.target.value)}
              suggestions={getFieldSuggestions('companyPhone2')}
              onSelectSuggestion={(val) => handleInputChange('companyPhone2', val)}
            />
            <AutocompleteInput
              label="Email"
              maxLength={50}
              value={formData.companyEmail}
              onChange={(e) => handleInputChange('companyEmail', e.target.value)}
              suggestions={getFieldSuggestions('companyEmail')}
              onSelectSuggestion={(val) => handleInputChange('companyEmail', val)}
            />
            <AutocompleteInput
              label="Website"
              maxLength={50}
              value={formData.companyWebsite || ''}
              onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
              suggestions={getFieldSuggestions('companyWebsite')}
              onSelectSuggestion={(val) => handleInputChange('companyWebsite', val)}
            />
          </div>

          {/* Lorry Receipt Basic Specs */}
          <h4 className="form-section-title">Consignment Basic Details</h4>
          <div className="form-grid-2">
            <AutocompleteInput
              label="Consignment Note No. (LR No)"
              placeholder="e.g. 159"
              maxLength={10}
              value={formData.lrNo}
              onChange={(e) => handleInputChange('lrNo', e.target.value)}
              suggestions={getFieldSuggestions('lrNo')}
              onSelectSuggestion={(val) => handleInputChange('lrNo', val)}
            />
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <AutocompleteInput
              label="From (Source)"
              placeholder="e.g. Pollachi"
              maxLength={25}
              value={formData.from}
              onChange={(e) => handleInputChange('from', e.target.value)}
              suggestions={getFieldSuggestions('from')}
              onSelectSuggestion={(val) => handleInputChange('from', val)}
            />
            <AutocompleteInput
              label="To (Destination)"
              placeholder="e.g. Chennai"
              maxLength={25}
              value={formData.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
              suggestions={getFieldSuggestions('to')}
              onSelectSuggestion={(val) => handleInputChange('to', val)}
            />
          </div>

          {/* Consignor Details */}
          <h4 className="form-section-title">Consignor details (Shipper)</h4>
          <AutocompleteInput
            label="Consignor Name"
            placeholder="e.g. Umesh Pencil Processors Pvt Ltd"
            maxLength={45}
            value={formData.consignorName}
            onChange={(e) => handleInputChange('consignorName', e.target.value)}
            suggestions={getFieldSuggestions('consignorName')}
            onSelectSuggestion={(val) => handleInputChange('consignorName', val)}
          />
          <AutocompleteTextarea
            label="Consignor Address"
            placeholder="e.g. Pollachi"
            rows={2}
            value={formData.consignorAddress}
            onChange={(e) => handleInputChange('consignorAddress', e.target.value)}
            suggestions={getFieldSuggestions('consignorAddress')}
            onSelectSuggestion={(val) => handleInputChange('consignorAddress', val)}
          />
          <AutocompleteInput
            label="Consignor GSTIN"
            placeholder="GSTIN"
            maxLength={20}
            value={formData.consignorGst}
            onChange={(e) => handleInputChange('consignorGst', e.target.value)}
            suggestions={getFieldSuggestions('consignorGst')}
            onSelectSuggestion={(val) => handleInputChange('consignorGst', val)}
          />

          {/* Consignee Details */}
          <h4 className="form-section-title">Consignee details (Receiver)</h4>
          <AutocompleteInput
            label="Consignee Name"
            placeholder="e.g. Hindustan Pencils Pvt. Ltd."
            maxLength={45}
            value={formData.consigneeName}
            onChange={(e) => handleInputChange('consigneeName', e.target.value)}
            suggestions={getFieldSuggestions('consigneeName')}
            onSelectSuggestion={(val) => handleInputChange('consigneeName', val)}
          />
          <AutocompleteTextarea
            label="Consignee Address"
            placeholder="e.g. Alwaye, Ernakulam"
            rows={2}
            value={formData.consigneeAddress}
            onChange={(e) => handleInputChange('consigneeAddress', e.target.value)}
            suggestions={getFieldSuggestions('consigneeAddress')}
            onSelectSuggestion={(val) => handleInputChange('consigneeAddress', val)}
          />
          <AutocompleteInput
            label="Consignee GSTIN"
            placeholder="GSTIN"
            maxLength={20}
            value={formData.consigneeGst}
            onChange={(e) => handleInputChange('consigneeGst', e.target.value)}
            suggestions={getFieldSuggestions('consigneeGst')}
            onSelectSuggestion={(val) => handleInputChange('consigneeGst', val)}
          />

          {/* Transit Details */}
          <h4 className="form-section-title">Transit & Payment Details</h4>
          <div className="form-grid-2">
            <AutocompleteInput
              label="Truck Number"
              placeholder="e.g. TN 72 AT 9459"
              maxLength={15}
              value={formData.truckNo}
              onChange={(e) => handleInputChange('truckNo', e.target.value)}
              suggestions={getFieldSuggestions('truckNo')}
              onSelectSuggestion={(val) => handleInputChange('truckNo', val)}
            />
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select 
                className="form-input"
                value={formData.paymentMode}
                onChange={(e) => handleInputChange('paymentMode', e.target.value)}
              >
                <option value="TOPAY">TO PAY</option>
                <option value="PAID">PAID</option>
                <option value="CREDIT">CREDIT</option>
              </select>
            </div>
          </div>

          {/* Cargo items section */}
          <h4 className="form-section-title">Goods & Description (Cargo Items)</h4>
          <table className="items-form-table" style={{ width: '100%', marginBottom: '10px' }}>
            <thead>
              <tr>
                <th style={{ width: '22%', fontSize: '0.75rem', padding: '4px' }}>Pkgs Qty</th>
                <th style={{ width: '42%', fontSize: '0.75rem', padding: '4px' }}>Description</th>
                <th style={{ width: '16%', fontSize: '0.75rem', padding: '4px' }}>Act Wt</th>
                <th style={{ width: '16%', fontSize: '0.75rem', padding: '4px' }}>Chg Wt</th>
                <th style={{ width: '4%' }}></th>
              </tr>
            </thead>
            <tbody>
              {(formData.cargoItems || []).map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <AutocompleteTableInput
                      placeholder="e.g. 100"
                      value={item.noOfPackages}
                      onChange={(e) => handleCargoItemChange(idx, 'noOfPackages', e.target.value)}
                      suggestions={getFieldSuggestionsForCargo('noOfPackages')}
                    />
                  </td>
                  <td>
                    <AutocompleteTableInput
                      placeholder="e.g. Cotton Box"
                      value={item.goodsDescription}
                      onChange={(e) => handleCargoItemChange(idx, 'goodsDescription', e.target.value)}
                      suggestions={getCargoSuggestions()}
                    />
                  </td>
                  <td>
                    <AutocompleteTableInput
                      placeholder="Kgs"
                      value={item.actualWeight}
                      onChange={(e) => handleCargoItemChange(idx, 'actualWeight', e.target.value)}
                      suggestions={getFieldSuggestionsForCargo('actualWeight')}
                    />
                  </td>
                  <td>
                    <AutocompleteTableInput
                      placeholder="Kgs"
                      value={item.chargedWeight}
                      onChange={(e) => handleCargoItemChange(idx, 'chargedWeight', e.target.value)}
                      suggestions={getFieldSuggestionsForCargo('chargedWeight')}
                    />
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="btn-icon-danger"
                      style={{ padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => removeCargoItemRow(idx)}
                      disabled={(formData.cargoItems || []).length <= 1}
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            type="button" 
            className="btn-add-item" 
            style={{ marginBottom: '1.5rem', padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            onClick={addCargoItemRow}
          >
            <Plus size={12} /> Add Cargo Row
          </button>
 
          {/* Tracking & references */}
          <h4 className="form-section-title">References & Marks</h4>
          <div className="form-grid-2">
            <AutocompleteInput
              label="E-way Bill No."
              placeholder="e.g. 331245678912"
              maxLength={12}
              value={formData.ewayBillNo}
              onChange={(e) => handleInputChange('ewayBillNo', e.target.value)}
              suggestions={getFieldSuggestions('ewayBillNo')}
              onSelectSuggestion={(val) => handleInputChange('ewayBillNo', val)}
            />
            <AutocompleteInput
              label="Private Marks"
              placeholder="e.g. Seal No. - 274740"
              maxLength={30}
              value={formData.privateMarks}
              onChange={(e) => handleInputChange('privateMarks', e.target.value)}
              suggestions={getFieldSuggestions('privateMarks')}
              onSelectSuggestion={(val) => handleInputChange('privateMarks', val)}
            />
          </div>

          <div className="form-grid-2">
            <AutocompleteInput
              label="Invoice No."
              placeholder="Seller Invoice No"
              maxLength={20}
              value={formData.invoiceNo}
              onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
              suggestions={getFieldSuggestions('invoiceNo')}
              onSelectSuggestion={(val) => handleInputChange('invoiceNo', val)}
            />
            <AutocompleteInput
              label="Value Rs."
              placeholder="Cargo Value"
              maxLength={12}
              value={formData.valueRs}
              onChange={(e) => handleInputChange('valueRs', e.target.value)}
              suggestions={getFieldSuggestions('valueRs')}
              onSelectSuggestion={(val) => handleInputChange('valueRs', val)}
            />
          </div>
 
          {/* Charges panel */}
          <h4 className="form-section-title">Lorry Freight & Charges Breakdown</h4>
          <div className="form-grid-3">
            <AutocompleteInput
              label="Freight Amount (Total)"
              placeholder="e.g. 9111"
              maxLength={8}
              value={formData.charges.freightAmount}
              onChange={(e) => handleChargeChange('freightAmount', e.target.value)}
              suggestions={getFieldSuggestions('charges.freightAmount')}
              onSelectSuggestion={(val) => handleChargeChange('freightAmount', val)}
            />
            <AutocompleteInput
              label="Hamali Charges"
              placeholder="e.g. 100"
              maxLength={8}
              value={formData.charges.hamali}
              onChange={(e) => handleChargeChange('hamali', e.target.value)}
              suggestions={getFieldSuggestions('charges.hamali')}
              onSelectSuggestion={(val) => handleChargeChange('hamali', val)}
            />
          </div>

          <div className="form-grid-3">
            <AutocompleteInput
              label="Door Pick-up"
              placeholder="e.g. 200"
              maxLength={8}
              value={formData.charges.doorPickup}
              onChange={(e) => handleChargeChange('doorPickup', e.target.value)}
              suggestions={getFieldSuggestions('charges.doorPickup')}
              onSelectSuggestion={(val) => handleChargeChange('doorPickup', val)}
            />
            <AutocompleteInput
              label="Door Delivery"
              placeholder="e.g. 200"
              maxLength={8}
              value={formData.charges.doorDelivery}
              onChange={(e) => handleChargeChange('doorDelivery', e.target.value)}
              suggestions={getFieldSuggestions('charges.doorDelivery')}
              onSelectSuggestion={(val) => handleChargeChange('doorDelivery', val)}
            />
            <AutocompleteInput
              label="Statistical Charges"
              placeholder="e.g. 80"
              maxLength={8}
              value={formData.charges.statistical}
              onChange={(e) => handleChargeChange('statistical', e.target.value)}
              suggestions={getFieldSuggestions('charges.statistical')}
              onSelectSuggestion={(val) => handleChargeChange('statistical', val)}
            />
          </div>

          <div className="form-grid-3">
            <AutocompleteInput
              label="A.O.C"
              placeholder="e.g. 50"
              maxLength={8}
              value={formData.charges.aoc}
              onChange={(e) => handleChargeChange('aoc', e.target.value)}
              suggestions={getFieldSuggestions('charges.aoc')}
              onSelectSuggestion={(val) => handleChargeChange('aoc', val)}
            />
            <AutocompleteInput
              label="F.O.C"
              placeholder="e.g. 50"
              maxLength={8}
              value={formData.charges.foc}
              onChange={(e) => handleChargeChange('foc', e.target.value)}
              suggestions={getFieldSuggestions('charges.foc')}
              onSelectSuggestion={(val) => handleChargeChange('foc', val)}
            />
            <AutocompleteInput
              label="Others"
              placeholder="e.g. 100"
              maxLength={8}
              value={formData.charges.others}
              onChange={(e) => handleChargeChange('others', e.target.value)}
              suggestions={getFieldSuggestions('charges.others')}
              onSelectSuggestion={(val) => handleChargeChange('others', val)}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">GST Rate (%)</label>
              <select
                className="form-input"
                value={formData.charges.gstRate}
                onChange={(e) => handleChargeChange('gstRate', e.target.value)}
              >
                <option value="0">0% (Exempted)</option>
                <option value="5">5% (Standard Transport)</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
              </select>
            </div>
          </div>

          {/* Authorized Signature Upload */}
          <h4 className="form-section-title">Authorized Signature</h4>
          <div style={{ 
            marginBottom: '1.5rem', 
            backgroundColor: '#1E2330', 
            padding: '12px', 
            borderRadius: '6px', 
            border: '1px solid #262D3D',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleSignatureUpload} 
                style={{ display: 'none' }}
                id="sig-upload-input"
              />
              <label 
                htmlFor="sig-upload-input" 
                className="btn-outline" 
                style={{ 
                  padding: '6px 12px', 
                  fontSize: '0.8rem', 
                  cursor: 'pointer',
                  borderColor: 'rgba(241, 180, 0, 0.4)',
                  color: '#F1B400',
                  margin: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '4px',
                  borderWidth: '1.5px',
                  borderStyle: 'solid'
                }}
              >
                Upload Signature Image
              </label>
              {signatureImage && (
                <button 
                  className="btn-outline" 
                  style={{ 
                    padding: '6px 12px', 
                    fontSize: '0.8rem', 
                    color: '#EF4444', 
                    borderColor: '#EF4444',
                    margin: 0,
                    borderRadius: '4px'
                  }}
                  onClick={handleRemoveSignature}
                >
                  Remove
                </button>
              )}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Supports JPG, PNG, WEBP, etc. Max size 5MB.
            </span>
            {signatureImage && (
              <div style={{ 
                marginTop: '8px', 
                backgroundColor: '#FFFFFF', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                maxHeight: '40px',
                alignSelf: 'flex-start'
              }}>
                <img 
                  src={signatureImage} 
                  alt="Signature Preview" 
                  style={{ maxHeight: '32px', objectFit: 'contain' }} 
                />
              </div>
            )}
          </div>

          {/* Copy indicators checklist */}
          <h4 className="form-section-title">Copy Type Selection</h4>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', backgroundColor: '#1E2330', padding: '10px', borderRadius: '6px', border: '1px solid #262D3D' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', color: '#E2E8F0' }}>
              <input 
                type="checkbox" 
                checked={formData.consignorCopy || false} 
                onChange={(e) => handleInputChange('consignorCopy', e.target.checked)} 
              />
              Consignor Copy
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', color: '#E2E8F0' }}>
              <input 
                type="checkbox" 
                checked={formData.consigneeCopy || false} 
                onChange={(e) => handleInputChange('consigneeCopy', e.target.checked)} 
              />
              Consignee Copy
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', color: '#E2E8F0' }}>
              <input 
                type="checkbox" 
                checked={formData.trackCopy || false} 
                onChange={(e) => handleInputChange('trackCopy', e.target.checked)} 
              />
              Track Copy
            </label>
          </div>

          {/* Form Actions */}
          <div className="form-actions-row" style={{ marginTop: '20px' }}>
            <button className="btn-outline" style={{ flex: 1, padding: '0.6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', color: '#EF4444', borderColor: '#EF4444', fontSize: '0.8rem' }} onClick={handleClearForm}>
              <Trash2 size={16} /> Clear
            </button>
            <button className="btn-outline" style={{ flex: 1, padding: '0.6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }} onClick={handleSaveLR}>
              <Save size={16} /> Save LR
            </button>
            <button className="btn-primary" style={{ flex: 1, padding: '0.6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }} onClick={handleDownloadPDF}>
              <Printer size={16} /> Download PDF
            </button>
          </div>

        </div>

        {/* Right Hand Live Preview Container */}
        <div className="lr-preview-container" ref={previewContainerRef}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px 0', backgroundColor: '#f0f2f5', minHeight: 'calc(100vh - 120px)' }}>
            
            {/* Scale wrapper to prevent scrolling and shrink card visually */}
            <div style={{ 
              width: `${1123 * previewScale}px`, 
              height: `${cardHeight * cargoChunks.length * previewScale}px`, 
              position: 'relative',
              margin: '0 auto'
            }}>
              <div id="lr-scale-wrapper" style={{ 
                transform: `scale(${previewScale})`, 
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '1123px',
                height: `${cardHeight * cargoChunks.length}px`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0px'
              }}>
                <div id="lr-pdf-pages" style={{ display: 'flex', flexDirection: 'column', gap: '0px', width: '100%' }}>
                  {cargoChunks.map((chunk, pageIndex) => (
                    <div key={pageIndex} style={{ width: '100%' }}>
                      {pageIndex > 0 && <div className="html2pdf__page-break" style={{ height: 0, margin: 0, padding: 0 }}></div>}
                      <div 
                        className="lr-preview-card" 
                        ref={pageIndex === 0 ? cardRef : null}
                      >
                        <div className="lr-preview-card-inner">
                {/* Top Header Section */}
                <div style={{ display: 'flex', width: '100%', alignItems: 'stretch', borderBottom: '2px solid #08103A' }}>
                  
                  {/* Logo Box */}
                  <div style={{ width: '8%', borderRight: '2px solid #08103A', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2px' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img src="/logo2.png" alt="Logo" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
                      <span style={{ 
                        position: 'absolute', 
                        top: '1px', 
                        right: '0px', 
                        fontSize: '0.45rem', 
                        fontWeight: 'bold', 
                        color: '#08103A',
                        lineHeight: '1'
                      }}>TM</span>
                    </div>
                  </div>

                  {/* Tax Info Box */}
                  <div style={{ width: '17%', borderRight: '2px solid #08103A', padding: '2px 4px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <table style={{ fontSize: '0.6rem', fontWeight: '900', lineHeight: '1.3', borderCollapse: 'collapse', width: '100%' }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: '0' }}>GSTIN</td>
                          <td style={{ padding: '0' }}>: {formData.companyGstin}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '0' }}>PAN</td>
                          <td style={{ padding: '0' }}>: {formData.companyPan}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '0' }}>UDYAM</td>
                          <td style={{ padding: '0' }}>: {formData.companyUdyam}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '0', whiteSpace: 'nowrap' }}>ISO <span style={{fontSize:'0.45rem'}}>Certificate</span></td>
                          <td style={{ padding: '0' }}>: {formData.companyIso}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Main Title Box */}
                  <div style={{ width: '56%', padding: '2px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ paddingLeft: '20px', margin: '0 0 2px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <img src="/Title.png" alt="SREE VAARAHI AMMAN TRANSPORTS" style={{ height: '40px', width: '580px', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', width: '100%', paddingLeft: '20px' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 'bold', textAlign: 'center', lineHeight: '1.2' }}>
                        228/1, Rakkiyapalayam,<br/>Avinashi, Tirupur - 641 654.
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '900', backgroundColor: '#e2e8f0', padding: '2px 10px', borderRadius: '4px' }}>
                        CONTAINER SUPPLYING AGENCY
                      </div>
                    </div>
                  </div>

                  {/* Contact Box */}
                  <div style={{ width: '19%', padding: '2px 4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <a 
                      href={getWhatsAppUrl(formData.companyPhone1)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6rem', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      <img src={WHATSAPP_ICON_SVG} alt="WA" style={{verticalAlign:'middle'}}/>
                      <span>: {formData.companyPhone1}</span>
                    </a>
                    <a 
                      href={getTelUrl(formData.companyPhone2)} 
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6rem', fontWeight: 'bold', marginTop: '3px', textDecoration: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      <img src={PHONE_ICON_SVG} alt="Ph" style={{verticalAlign:'middle'}}/>
                      <span>: {formData.companyPhone2}</span>
                    </a>
                    <a 
                      href={`mailto:${formData.companyEmail}`} 
                      style={{ fontSize: '0.52rem', fontWeight: '900', marginTop: '4px', textDecoration: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      Mail: {formData.companyEmail}
                    </a>
                    <a 
                      href={formData.companyWebsite ? (formData.companyWebsite.startsWith('http') ? formData.companyWebsite : `https://${formData.companyWebsite}`) : 'https://www.sreevaarahiammantransports.com'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.52rem', fontWeight: '900', marginTop: '4px', textDecoration: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      Web: {formData.companyWebsite || 'www.sreevaarahiammantransports.com'}
                    </a>
                  </div>
                  
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0' }}>
                  <tbody>
                    <tr>
                      {/* Consignor Box */}
                      <td style={{ width: '38%', borderRight: '3px solid #08103A', borderBottom: '3px solid #08103A', padding: '6px', verticalAlign: 'top' }}>
                        <div className="bg-dark-text-white" style={{ fontWeight: '900', fontSize: '0.65rem', padding: '1px 6px', marginBottom: '6px', display: 'inline-block' }}>CONSIGNOR :</div>
                        <div style={{ fontSize: '0.7rem', lineHeight: '1.3' }}>
                          
                          <div style={{ display: 'flex', marginBottom: '4px', alignItems: 'flex-end' }}>
                            <span style={{ fontWeight: 'bold', display: 'inline-block', width: '55px', whiteSpace: 'nowrap' }}>Name :</span>
                            <span style={{ 
                              fontWeight: 'bold', 
                              flex: 1, 
                              backgroundImage: `url("${DOTTED_LINE_SVG}")`,
                              backgroundSize: '4px 1.25rem',
                              backgroundRepeat: 'repeat-x',
                              backgroundPosition: 'bottom left',
                              wordBreak: 'break-word', 
                              overflowWrap: 'break-word', 
                              minHeight: '1.1rem', 
                              paddingBottom: '1px' 
                            }}>
                              {formData.consignorName || '\u00A0'}
                            </span>
                          </div>
                          
                          <div style={{ 
                            lineHeight: '1.25rem', 
                            backgroundImage: `linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%), linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%), url("${DOTTED_LINE_SVG}")`, 
                            backgroundSize: '55px 1.35rem, 100% 3px, 4px 1.25rem', 
                            backgroundRepeat: 'no-repeat, no-repeat, repeat', 
                            backgroundPosition: 'top left, top left, top left',
                            minHeight: '3.75rem', 
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                            marginBottom: '4px'
                          }}>
                            <span style={{ fontWeight: 'bold', display: 'inline-block', width: '55px' }}>Address :</span>
                            <span style={{ fontWeight: 'bold' }}>{formData.consignorAddress}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <span style={{ fontWeight: 'bold', display: 'inline-block', width: '55px', whiteSpace: 'nowrap' }}>GSTIN :</span>
                            <span style={{ 
                              fontWeight: 'bold', 
                              flex: 1, 
                              backgroundImage: `url("${DOTTED_LINE_SVG}")`,
                              backgroundSize: '4px 1.25rem',
                              backgroundRepeat: 'repeat-x',
                              backgroundPosition: 'bottom left',
                              wordBreak: 'break-all', 
                              overflowWrap: 'break-word', 
                              minHeight: '1.1rem', 
                              paddingBottom: '1px' 
                            }}>
                              {formData.consignorGst || '\u00A0'}
                            </span>
                          </div>
                          
                        </div>
                      </td>

                      {/* Consignee Box */}
                      <td style={{ width: '38%', borderRight: '3px solid #08103A', borderBottom: '3px solid #08103A', padding: '6px', verticalAlign: 'top' }}>
                        <div className="bg-dark-text-white" style={{ fontWeight: '900', fontSize: '0.65rem', padding: '1px 6px', marginBottom: '6px', display: 'inline-block' }}>CONSIGNEE :</div>
                        <div style={{ fontSize: '0.7rem', lineHeight: '1.3' }}>
                          
                          <div style={{ display: 'flex', marginBottom: '4px', alignItems: 'flex-end' }}>
                            <span style={{ fontWeight: 'bold', display: 'inline-block', width: '55px', whiteSpace: 'nowrap' }}>Name :</span>
                            <span style={{ 
                              fontWeight: 'bold', 
                              flex: 1, 
                              backgroundImage: `url("${DOTTED_LINE_SVG}")`,
                              backgroundSize: '4px 1.25rem',
                              backgroundRepeat: 'repeat-x',
                              backgroundPosition: 'bottom left',
                              wordBreak: 'break-word', 
                              overflowWrap: 'break-word', 
                              minHeight: '1.1rem', 
                              paddingBottom: '1px' 
                            }}>
                              {formData.consigneeName || '\u00A0'}
                            </span>
                          </div>
                          
                          <div style={{ 
                            lineHeight: '1.25rem', 
                            backgroundImage: `linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%), linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%), url("${DOTTED_LINE_SVG}")`, 
                            backgroundSize: '55px 1.35rem, 100% 3px, 4px 1.25rem', 
                            backgroundRepeat: 'no-repeat, no-repeat, repeat', 
                            backgroundPosition: 'top left, top left, top left',
                            minHeight: '3.75rem', 
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                            marginBottom: '4px'
                          }}>
                            <span style={{ fontWeight: 'bold', display: 'inline-block', width: '55px' }}>Address :</span>
                            <span style={{ fontWeight: 'bold' }}>{formData.consigneeAddress}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <span style={{ fontWeight: 'bold', display: 'inline-block', width: '55px', whiteSpace: 'nowrap' }}>GSTIN :</span>
                            <span style={{ 
                              fontWeight: 'bold', 
                              flex: 1, 
                              backgroundImage: `url("${DOTTED_LINE_SVG}")`,
                              backgroundSize: '4px 1.25rem',
                              backgroundRepeat: 'repeat-x',
                              backgroundPosition: 'bottom left',
                              wordBreak: 'break-all', 
                              overflowWrap: 'break-word', 
                              minHeight: '1.1rem', 
                              paddingBottom: '1px' 
                            }}>
                              {formData.consigneeGst || '\u00A0'}
                            </span>
                          </div>
                          
                        </div>
                      </td>

                      {/* Consignment Note Box */}
                      <td style={{ width: '24%', borderBottom: '3px solid #08103A', padding: '0', verticalAlign: 'top' }}>
                        <div style={{ padding: '6px 4px', textAlign: 'center', borderBottom: '3px solid #08103A' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>AT OWNER'S RISK</div>
                          <div style={{ fontSize: '0.75rem', fontWeight: '900', textDecoration: 'underline', marginTop: '2px' }}>CONSIGNMENT NOTE</div>
                        </div>
                        <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #08103A', padding: '5px 6px', alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1 }}>
                              <span style={{ fontWeight: 'bold', display: 'inline-block', width: '30px', whiteSpace: 'nowrap' }}>No :</span>
                              <span style={{ 
                                fontWeight: 'bold', 
                                flex: 1, 
                                color: '#c2410c',
                                backgroundImage: `url("${DOTTED_LINE_SVG}")`,
                                backgroundSize: '4px 1.25rem',
                                backgroundRepeat: 'repeat-x',
                                backgroundPosition: 'bottom left',
                                minHeight: '1.1rem',
                                paddingBottom: '1px',
                                paddingLeft: '2px'
                              }}>
                                {formData.lrNo || '\u00A0'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1.2, marginLeft: '8px' }}>
                              <span style={{ fontWeight: 'bold', display: 'inline-block', width: '40px', whiteSpace: 'nowrap' }}>Date :</span>
                              <span style={{ 
                                fontWeight: 'bold', 
                                flex: 1, 
                                backgroundImage: `url("${DOTTED_LINE_SVG}")`,
                                backgroundSize: '4px 1.25rem',
                                backgroundRepeat: 'repeat-x',
                                backgroundPosition: 'bottom left',
                                minHeight: '1.1rem',
                                paddingBottom: '1px',
                                paddingLeft: '2px'
                              }}>
                                {formatDate(formData.date) || '\u00A0'}
                              </span>
                            </div>
                          </div>
                          <div style={{ borderBottom: '3px solid #08103A', padding: '5px 6px', display: 'flex', alignItems: 'flex-end' }}>
                            <span style={{ fontWeight: 'bold', display: 'inline-block', width: '55px', whiteSpace: 'nowrap' }}>From :</span>
                            <span style={{ 
                              fontWeight: 'bold', 
                              flex: 1, 
                              backgroundImage: `url("${DOTTED_LINE_SVG}")`,
                              backgroundSize: '4px 1.25rem',
                              backgroundRepeat: 'repeat-x',
                              backgroundPosition: 'bottom left',
                              wordBreak: 'break-word', 
                              overflowWrap: 'break-word', 
                              minHeight: '1.1rem', 
                              paddingBottom: '1px' 
                            }}>
                              {formData.from || '\u00A0'}
                            </span>
                          </div>
                          <div style={{ padding: '5px 6px', display: 'flex', alignItems: 'flex-end' }}>
                            <span style={{ fontWeight: 'bold', display: 'inline-block', width: '55px', whiteSpace: 'nowrap' }}>To :</span>
                            <span style={{ 
                              fontWeight: 'bold', 
                              flex: 1, 
                              backgroundImage: `url("${DOTTED_LINE_SVG}")`,
                              backgroundSize: '4px 1.25rem',
                              backgroundRepeat: 'repeat-x',
                              backgroundPosition: 'bottom left',
                              wordBreak: 'break-word', 
                              overflowWrap: 'break-word', 
                              minHeight: '1.1rem', 
                              paddingBottom: '1px' 
                            }}>
                              {formData.to || '\u00A0'}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

              {/* Main Cargo Specs Table Split */}
              <table style={{ width: '100%', borderCollapse: 'collapse', flex: 1, height: '100%' }}>
                <tbody style={{ height: '100%' }}>
                  <tr style={{ height: '100%' }}>
                    {/* Left Column (68%) */}
                    <td style={{ width: '68%', borderRight: '3px solid #08103A', verticalAlign: 'top', padding: 0, height: '100%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        
                        {/* Cargo Table Wrapper */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', height: '100%', tableLayout: 'fixed' }}>
                            <thead>
                              <tr style={{ borderBottom: '3px solid #08103A' }}>
                                <th style={{ borderRight: '1.5px solid #08103A', padding: '6px', fontSize: '0.65rem', width: '15%' }}>No. of Packages</th>
                                <th style={{ borderRight: '1.5px solid #08103A', padding: '6px', fontSize: '0.65rem', width: '55%' }}>GOODS DESCRIPTION</th>
                                <th style={{ borderRight: '1.5px solid #08103A', padding: '6px', fontSize: '0.65rem', width: '15%' }}>Actual Weight in Kgs.</th>
                                <th style={{ padding: '6px', fontSize: '0.65rem', width: '15%' }}>Charged Weight in Kgs.</th>
                              </tr>
                            </thead>
                            <tbody>
                              {chunk.map((item, index) => (
                                <tr key={index}>
                                  <td style={{ borderRight: '1.5px solid #08103A', padding: '6px 8px', textAlign: 'center', verticalAlign: 'top', fontSize: '0.8rem', fontWeight: 'bold', wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{item.noOfPackages || '\u00A0'}</td>
                                  <td style={{ borderRight: '1.5px solid #08103A', padding: '6px 8px', verticalAlign: 'top', fontSize: '0.85rem', fontWeight: 'bold', wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{item.goodsDescription || '\u00A0'}</td>
                                  <td style={{ borderRight: '1.5px solid #08103A', padding: '6px 8px', textAlign: 'center', verticalAlign: 'top', fontSize: '0.8rem', fontWeight: 'bold', wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{item.actualWeight || '\u00A0'}</td>
                                  <td style={{ padding: '6px 8px', textAlign: 'center', verticalAlign: 'top', fontSize: '0.8rem', fontWeight: 'bold', wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{item.chargedWeight || '\u00A0'}</td>
                                </tr>
                              ))}

                              {/* Dummy row to absorb remaining vertical space so cargo items aren't stretched */}
                              <tr style={{ height: '100%' }}>
                                <td style={{ borderRight: '1.5px solid #08103A' }}></td>
                                <td style={{ borderRight: '1.5px solid #08103A' }}></td>
                                <td style={{ borderRight: '1.5px solid #08103A' }}></td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Reference Table (E-way, Private Marks, Invoice No, Value Rs) */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', borderTop: '3px solid #08103A', borderBottom: '3px solid #08103A' }}>
                          <tbody>
                            <tr>
                              <td colSpan={2} style={{ width: '60%', borderRight: '1.5px solid #08103A', borderBottom: '1.5px solid #08103A', padding: '6px 8px' }}>
                                <div style={{ fontSize: '0.7rem', width: '100%', lineHeight: '1.2' }}>
                                  <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>E-way Bill No:</span>
                                  <span style={{ fontWeight: 'bold', fontSize: '0.8rem', marginLeft: '4px' }}>
                                    {formData.ewayBillNo || '\u00A0'}
                                  </span>
                                </div>
                              </td>
                              <td rowSpan={2} style={{ width: '40%', padding: '6px 8px', verticalAlign: 'top' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>Private Marks :</div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginTop: '6px' }}>
                                  {formData.privateMarks || '\u00A0'}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: '30%', borderRight: '1.5px solid #08103A', padding: '6px 8px' }}>
                                <div style={{ fontSize: '0.7rem', width: '100%', lineHeight: '1.2' }}>
                                  <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Invoice No:</span>
                                  <span style={{ fontWeight: 'bold', fontSize: '0.8rem', marginLeft: '4px' }}>
                                    {formData.invoiceNo || '\u00A0'}
                                  </span>
                                </div>
                              </td>
                              <td style={{ width: '30%', borderRight: '1.5px solid #08103A', padding: '6px 8px' }}>
                                <div style={{ fontSize: '0.7rem', width: '100%', lineHeight: '1.2' }}>
                                  <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Value Rs:</span>
                                  <span style={{ fontWeight: 'bold', fontSize: '0.8rem', marginLeft: '4px' }}>
                                    {formData.valueRs || '\u00A0'}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Signatures & Note Row */}
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <tbody>
                            <tr>
                              {/* Note Box */}
                              <td style={{ width: '30%', borderRight: '3px solid #08103A', padding: '4px 6px', verticalAlign: 'top' }}>
                                <strong style={{ fontSize: '0.65rem', display: 'block', textAlign: 'left' }}>Note :</strong>
                                <div style={{ marginTop: '12px', fontSize: '0.58rem', lineHeight: '1.25', textAlign: 'center', fontWeight: 'bold' }}>
                                  This Consignment Note is issued under<br />
                                  subject to terms & conditions<br />
                                  Printed overleaf
                                </div>
                              </td>
                              {/* Receiver's Signature Box */}
                              <td style={{ width: '35%', borderRight: '3px solid #08103A', padding: '6px', verticalAlign: 'top', fontSize: '0.65rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100px', justifyContent: 'space-between' }}>
                                  <div style={{ textAlign: 'center' }}>Received the goods in good condition and order</div>
                                  <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '15px' }}>
                                    <div style={{ borderBottom: '1px dotted #08103A', width: '80%', margin: '0 auto 4px' }}></div>
                                    <strong>Receiver's Signature with seal</strong>
                                  </div>
                                </div>
                              </td>
                              {/* Authorised Signature Box */}
                              <td style={{ width: '35%', padding: '6px', verticalAlign: 'top', fontSize: '0.65rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100px', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <img src="/Title.png" alt="SREE VAARAHI AMMAN TRANSPORTS" style={{ height: '18px', width: 'auto', objectFit: 'contain' }} />
                                  </div>
                                  {signatureImage && (
                                    <img 
                                      src={signatureImage} 
                                      alt="Signature" 
                                      style={{ 
                                        position: 'absolute', 
                                        top: '20px', 
                                        height: '54px', 
                                        maxWidth: '260px', 
                                        objectFit: 'contain',
                                        pointerEvents: 'none'
                                      }} 
                                    />
                                  )}
                                  <div style={{ textAlign: 'center', width: '100%', marginTop: 'auto', paddingTop: '15px' }}>
                                    <div style={{ borderBottom: '1px dotted #08103A', width: '80%', margin: '0 auto 4px' }}></div>
                                    <strong>Authorised Signature</strong>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Bottom Footer Section */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '30px', alignItems: 'center', padding: '4px 8px', borderTop: '3px solid #08103A' }}>
                          <div style={{ lineHeight: '1.2', textAlign: 'left' }}>
                            <span style={{ textDecoration: 'underline', fontWeight: '900', fontSize: '0.72rem' }}>TERMS & CONDITIONS</span><br />
                            <span style={{ fontWeight: 'bold', fontSize: '0.62rem' }}>AND ANY ENQUIRES</span>
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#08103A', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '30px' }}>
                            <span>
                              CONTACT : <a 
                                href={getTelUrl('9655237104')} 
                                style={{ 
                                  color: '#08103A', 
                                  textDecoration: 'none', 
                                  cursor: 'pointer' 
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                              >
                                9655237104
                              </a>
                            </span>
                            <a 
                              href={formData.companyWebsite ? (formData.companyWebsite.startsWith('http') ? formData.companyWebsite : `https://${formData.companyWebsite}`) : 'https://www.sreevaarahiammantransports.com'} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ 
                                color: '#08103A', 
                                textDecoration: 'underline', 
                                fontSize: '0.95rem', 
                                fontWeight: '900',
                                cursor: 'pointer'
                              }}
                            >
                              {formData.companyWebsite || 'www.sreevaarahiammantransports.com'}
                            </a>
                          </div>
                        </div>

                      </div>
                    </td>

                    {/* Right Column (32%) */}
                    <td style={{ width: '32%', verticalAlign: 'top', padding: 0, height: '100%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        
                        {/* Truck & Payment Info */}
                        <div style={{ padding: '6px', borderBottom: '3px solid #08103A', fontSize: '0.7rem', lineHeight: '1.5' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong>TRUCK NUMBER:</strong>
                            <span style={{ 
                              fontWeight: 'bold', 
                              fontSize: '0.85rem', 
                              color: '#08103A',
                              backgroundImage: `url("${DOTTED_LINE_SVG}")`,
                              backgroundSize: '4px 1.25rem',
                              backgroundRepeat: 'repeat-x',
                              backgroundPosition: 'bottom left',
                              minHeight: '1.3rem',
                              paddingBottom: '1px',
                              display: 'block',
                              marginTop: '2px'
                            }}>
                              {formData.truckNo || '\u00A0'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                            <strong>PAYMENT:</strong>
                            <span className={formData.paymentMode === 'TOPAY' ? 'payment-pill-selected' : 'payment-pill-unselected'} style={{fontSize: '0.65rem'}}>TOPAY</span>
                            <span className={formData.paymentMode === 'PAID' ? 'payment-pill-selected' : 'payment-pill-unselected'} style={{fontSize: '0.65rem'}}>PAID</span>
                            <span className={formData.paymentMode === 'CREDIT' ? 'payment-pill-selected' : 'payment-pill-unselected'} style={{fontSize: '0.65rem'}}>CREDIT</span>
                          </div>
                        </div>

                        {/* Charges breakdown table Wrapper */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.65rem', height: '100%' }}>
                            <thead>
                              <tr style={{ borderBottom: '1.5px solid #08103A' }}>
                                <th style={{ borderRight: '1.5px solid #08103A', padding: '4px', textAlign: 'center', width: '60%' }}>Particulars</th>
                                <th style={{ borderRight: '1.5px solid #08103A', padding: '4px', textAlign: 'center', width: '28%' }}>Rs.</th>
                                <th style={{ padding: '4px', textAlign: 'center', width: '12%' }}>Ps.</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { label: 'Freight Per Kg. / CFT', amount: freightAmount },
                                { label: 'Hamali', amount: formData.charges.hamali },
                                { label: 'Door Pick-up Charges', amount: formData.charges.doorPickup },
                                { label: 'Door Delivery Charges', amount: formData.charges.doorDelivery },
                                { label: 'Statistical Charges', amount: formData.charges.statistical },
                                { label: 'A.O.C', amount: formData.charges.aoc },
                                { label: 'F.O.C', amount: formData.charges.foc },
                                { label: 'Others', amount: formData.charges.others }
                              ].map((item, idx) => {
                                const { rs, ps } = getRsPs(item.amount);
                                return (
                                  <tr key={idx} style={{ borderBottom: '1px solid rgba(8, 16, 58, 0.2)' }}>
                                    <td style={{ borderRight: '1.5px solid #08103A', padding: '4px 6px', fontWeight: '900', fontSize: '0.72rem', color: '#08103A' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', minHeight: '18px', height: '100%' }}>{item.label}</div>
                                    </td>
                                    <td style={{ borderRight: '1.5px solid #08103A', padding: '4px 6px', fontWeight: '900', fontSize: '0.75rem', color: '#08103A' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>{rs}</div>
                                    </td>
                                    <td style={{ padding: '4px 6px', fontWeight: '900', fontSize: '0.75rem', color: '#08103A' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{ps}</div>
                                    </td>
                                  </tr>
                                );
                              })}

                              {/* Subtotal */}
                              {(() => {
                                const { rs, ps } = getRsPs(subtotal);
                                return (
                                  <tr style={{ borderBottom: '1.5px solid #08103A' }}>
                                    <td style={{ borderRight: '1.5px solid #08103A', padding: '4px 6px', fontWeight: 'bold' }}>SUB. TOTAL</td>
                                    <td style={{ borderRight: '1.5px solid #08103A', padding: '4px 6px', textAlign: 'right', fontWeight: 'bold' }}>{rs}</td>
                                    <td style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>{ps}</td>
                                  </tr>
                                );
                              })()}

                              {/* GST */}
                              {(() => {
                                const { rs, ps } = getRsPs(gstAmount);
                                return (
                                  <tr style={{ borderBottom: '2px solid #08103A' }}>
                                    <td style={{ borderRight: '1.5px solid #08103A', padding: '4px 6px', fontWeight: 'bold' }}>GST @ {formData.charges.gstRate}%</td>
                                    <td style={{ borderRight: '1.5px solid #08103A', padding: '4px 6px', textAlign: 'right', fontWeight: 'bold' }}>{rs}</td>
                                    <td style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>{ps}</td>
                                  </tr>
                                );
                              })()}

                              {/* G.TOTAL */}
                              {(() => {
                                const { rs, ps } = getRsPs(totalAmount);
                                return (
                                  <tr style={{ borderBottom: '3px solid #08103A' }}>
                                    <td style={{ borderRight: '1.5px solid #08103A', padding: '6px', fontWeight: '900', fontSize: '0.75rem' }}>G.TOTAL</td>
                                    <td style={{ borderRight: '1.5px solid #08103A', padding: '6px', textAlign: 'right', fontWeight: '900', fontSize: '0.75rem' }}>{rs}</td>
                                    <td style={{ padding: '6px', textAlign: 'center', fontWeight: '900', fontSize: '0.75rem' }}>{ps}</td>
                                  </tr>
                                );
                              })()}

                              {/* Copy Types Selector Checklist */}
                              {[
                                { label: 'CONSIGNOR COPY', checked: formData.consignorCopy },
                                { label: 'CONSIGNEE COPY', checked: formData.consigneeCopy },
                                { label: 'TRACK COPY', checked: formData.trackCopy }
                              ].map((copy, index) => (
                                <tr key={`copy-${index}`} style={{ borderBottom: index < 2 ? '1.5px solid #08103A' : 'none', height: '24px' }}>
                                  <td style={{ borderRight: '1.5px solid #08103A', padding: '3px 6px', fontWeight: 'bold', fontSize: '0.58rem' }}>
                                    {copy.label}
                                  </td>
                                  <td colSpan={2} style={{ padding: '2px', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <div style={{
                                      width: '32px',
                                      height: '18px',
                                      border: '1.5px solid #08103A',
                                      margin: '0 auto',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.85rem',
                                      fontWeight: 'bold',
                                      backgroundColor: copy.checked ? 'rgba(8, 16, 58, 0.15)' : 'transparent'
                                    }}>
                                      {copy.checked ? '✓' : ''}
                                    </div>
                                  </td>
                                </tr>
                              ))}

                            </tbody>
                          </table>
                        </div>

                      </div>
                    </td>

                  </tr>
                </tbody>
              </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Clear Confirmation Modal */}
      {showClearConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#1E2330', padding: '24px', borderRadius: '8px', border: '1px solid #262D3D', color: '#fff', width: '300px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Clear Form</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.9rem', color: '#94A3B8' }}>Are you sure you want to clear the LR form?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }} onClick={() => setShowClearConfirm(false)}>No</button>
              <button className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.85rem', backgroundColor: '#EF4444', borderColor: '#EF4444', color: '#fff' }} onClick={confirmClearForm}>Yes, Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Save Confirmation Modal */}
      {showSaveConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#1E2330', padding: '24px', borderRadius: '8px', border: '1px solid #262D3D', color: '#fff', width: '300px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Save LR Details</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.9rem', color: '#94A3B8' }}>LR Details will be successfully saved to your local registry.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }} onClick={() => setShowSaveConfirm(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }} onClick={confirmSaveLR}>Save Details</button>
            </div>
          </div>
        </div>
      )}
    </div>                  
  );
}
