import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from './DashboardLayout';
import { getText } from '../utils/language';


interface MasterDataItem {
  _id: string;
  category: string;
  key: string;
  value: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  { key: 'organizationType', label: 'Organization Types', labelMr: 'संस्था प्रकार', icon: '🏢' },
  { key: 'industry', label: 'Industries', labelMr: 'उद्योग', icon: '🏭' },
  { key: 'region', label: 'States/Regions', labelMr: 'राज्ये/प्रदेश', icon: '🗺️' },
  { key: 'city', label: 'Cities', labelMr: 'शहरे', icon: '🏙️' },
  { key: 'center', label: 'Centers/Departments', labelMr: 'केंद्रे/विभाग', icon: '🏛️' },
  { key: 'organization', label: 'Organizations', labelMr: 'संस्था', icon: '🏢' },
  { key: 'country', label: 'Countries', labelMr: 'देश', icon: '🌍' },
  { key: 'currency', label: 'Currencies', labelMr: 'चलने', icon: '💰' },
  { key: 'timezone', label: 'Timezones', labelMr: 'वेळ क्षेत्रे', icon: '🕐' },
  { key: 'dateFormat', label: 'Date Formats', labelMr: 'तारीख स्वरूप', icon: '📅' },
  { key: 'language', label: 'Languages', labelMr: 'भाषा', icon: '🗣️' },
];

const MasterDataManagement = () => {
  const { i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('organizationType');
  const [items, setItems] = useState<MasterDataItem[]>([]);
  const [states, setStates] = useState<MasterDataItem[]>([]);
  const [cities, setCities] = useState<MasterDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
    displayOrder: 1,
    isActive: true,
    metadata: '',
    // Category-specific fields
    state: '',
    city: '',
    address: '',
    zipcode: '',
    timing: '',
    googleMapLink: '',
    phone: '',
    email: ''
  });

  // Fetch states and cities for dropdowns
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [statesRes, citiesRes] = await Promise.all([
          fetch('http://localhost:3003/api/master-data/category/region', { credentials: 'include' }),
          fetch('http://localhost:3003/api/master-data/category/city', { credentials: 'include' })
        ]);
        
        const statesData = await statesRes.json();
        const citiesData = await citiesRes.json();
        
        if (statesData.success) {
          setStates(statesData.data.items || []);
        }
        
        if (citiesData.success) {
          setCities(citiesData.data.items || []);
        }
      } catch (error) {
        console.error('Error fetching reference data:', error);
      }
    };
    
    fetchReferenceData();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [activeCategory]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3003/api/master-data/category/${activeCategory}?includeInactive=true`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setItems(data.data.items || []);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      key: '',
      value: '',
      description: '',
      displayOrder: items.length + 1,
      isActive: true,
      metadata: '',
      state: '',
      city: '',
      address: '',
      zipcode: '',
      timing: '',
      googleMapLink: '',
      phone: '',
      email: ''
    });
    setShowModal(true);
  };

  const handleEdit = (item: MasterDataItem) => {
    setEditingItem(item);
    const metadata = item.metadata || {};
    setFormData({
      key: item.key,
      value: item.value,
      description: item.description || '',
      displayOrder: item.displayOrder,
      isActive: item.isActive,
      metadata: item.metadata ? JSON.stringify(item.metadata, null, 2) : '',
      state: metadata.state || '',
      city: metadata.city || '',
      address: metadata.address || '',
      zipcode: metadata.zipcode || '',
      timing: metadata.timing || '',
      googleMapLink: metadata.googleMapLink || '',
      phone: metadata.phone || '',
      email: metadata.email || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm(getText('Are you sure you want to delete this item?', 'तुम्हाला हा आयटम हटवायचा आहे का?', 'तुम्हाला हा आयटम हटवायचा आहे का?'))) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3003/api/master-data/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleStatus = async (itemId: string) => {
    try {
      const response = await fetch(`http://localhost:3003/api/master-data/${itemId}/toggle-status`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Build metadata based on category
      let metadata: any = {};
      
      if (activeCategory === 'city') {
        metadata = {
          state: formData.state,
          country: 'india'
        };
      } else if (activeCategory === 'center') {
        metadata = {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          timing: formData.timing,
          googleMapLink: formData.googleMapLink,
          phone: formData.phone,
          email: formData.email
        };
      } else if (formData.metadata) {
        // For other categories, use the JSON metadata field
        metadata = JSON.parse(formData.metadata);
      }

      const payload = {
        category: activeCategory,
        key: formData.key.toLowerCase().replace(/\s+/g, '-'),
        value: formData.value,
        description: formData.description,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined
      };

      const url = editingItem 
        ? `http://localhost:3003/api/master-data/${editingItem._id}`
        : 'http://localhost:3003/api/master-data';
      
      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setShowModal(false);
        fetchItems();
      } else {
        alert(data.error || 'Failed to save item');
      }
    } catch (error: any) {
      console.error('Error saving item:', error);
      alert(error.message || 'Failed to save item');
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            {getText('⚙️ Master Data Management', '⚙️ मास्टर डेटा व्यवस्थापन', '⚙️ मास्टर डेटा व्यवस्थापन')}
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>
            {getText('Manage dropdown options and reference data across the system', 'सिस्टममध्ये ड्रॉपडाउन पर्याय आणि संदर्भ डेटा व्यवस्थापित करा', 'सिस्टममध्ये ड्रॉपडाउन पर्याय आणि संदर्भ डेटा व्यवस्थापित करा')}
          </p>
        </div>

        {/* Category Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '24px', 
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                padding: '12px 20px',
                border: activeCategory === cat.key ? '2px solid #f97316' : '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: activeCategory === cat.key ? '#fff7ed' : 'white',
                color: activeCategory === cat.key ? '#f97316' : '#6b7280',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{cat.icon}</span>
              {i18n.language === 'mr' ? cat.labelMr : cat.label}
            </button>
          ))}
        </div>

        {/* Action Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            {getText(`Total Items: ${items.length}`, `कुल आइटम: ${items.length}`, `एकूण आयटम: ${items.length}`)}
          </div>
          <button
            onClick={handleAddNew}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#f97316',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
          >
            <span style={{ fontSize: '18px' }}>+</span>
            {getText('Add New Item', 'नवीन आयटम जोडा', 'नवीन आयटम जोडा')}
          </button>
        </div>

        {/* Data Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
            {getText('Loading...', 'लोड करत आहे...', 'लोड करत आहे...')}
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    {getText('Key', 'की', 'की')}
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    {getText('Value', 'मूल्य', 'मूल्य')}
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    {getText('Description', 'वर्णन', 'वर्णन')}
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    {getText('Order', 'क्रम', 'क्रम')}
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    {getText('Status', 'स्थिती', 'स्थिती')}
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    {getText('Actions', 'क्रिया', 'क्रिया')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                      {getText('No items found. Click "Add New Item" to create one.', 'कोणतेही आयटम आढळले नाहीत. एक तयार करण्यासाठी "नवीन आयटम जोडा" वर क्लिक करा.', 'कोणतेही आयटम आढळले नाहीत. एक तयार करण्यासाठी "नवीन आयटम जोडा" वर क्लिक करा.')}
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#374151', fontFamily: 'monospace' }}>
                        {item.key}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                        {item.value}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                        {item.description || '-'}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
                        {item.displayOrder}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                          <input
                            type="checkbox"
                            checked={item.isActive}
                            onChange={() => toggleStatus(item._id)}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: item.isActive ? '#22c55e' : '#d1d5db',
                            transition: '0.3s',
                            borderRadius: '24px'
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '',
                              height: '18px',
                              width: '18px',
                              left: item.isActive ? '27px' : '3px',
                              bottom: '3px',
                              backgroundColor: 'white',
                              transition: '0.3s',
                              borderRadius: '50%'
                            }} />
                          </span>
                        </label>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleEdit(item)}
                            style={{
                              padding: '6px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              backgroundColor: 'white',
                              color: '#3b82f6',
                              fontSize: '13px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            ✏️ {getText('Edit', 'संपादित करा', 'संपादित करा')}
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            style={{
                              padding: '0',
                              width: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1.5px solid #E5E7EB',
                              borderRadius: '8px',
                              backgroundColor: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              outline: 'none',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#FEF2F2';
                              e.currentTarget.style.borderColor = '#DC2626';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'white';
                              e.currentTarget.style.borderColor = '#E5E7EB';
                            }}
                            title={getText('Delete', 'हटवा', 'हटवा')}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"/>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                              <line x1="10" y1="11" x2="10" y2="17"/>
                              <line x1="14" y1="11" x2="14" y2="17"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              {/* Modal Header */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  {editingItem 
                    ? (getText('Edit Item', 'आयटम संपादित करा', 'आयटम संपादित करा'))
                    : (getText('Add New Item', 'नवीन आयटम जोडा', 'नवीन आयटम जोडा'))}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      {getText('Key', 'की', 'की')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.key}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                      placeholder={getText('e.g., new-item-key', 'उदा., new-item-key', 'उदा., new-item-key')}
                      disabled={!!editingItem}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: editingItem ? '#f3f4f6' : 'white'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      {getText('Lowercase, use hyphens for spaces', 'लोअरकेस, रिक्त स्थानांसाठी हायफन वापरा', 'लोअरकेस, रिक्त स्थानांसाठी हायफन वापरा')}
                    </p>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      {getText('Display Value', 'प्रदर्शन मूल्य', 'प्रदर्शन मूल्य')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder={getText('Enter display value', 'प्रदर्शन मूल्य प्रविष्ट करा', 'प्रदर्शन मूल्य प्रविष्ट करा')}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      {getText('Description', 'वर्णन', 'वर्णन')}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={getText('Enter description (optional)', 'वर्णन प्रविष्ट करा (पर्यायी)', 'वर्णन प्रविष्ट करा (पर्यायी)')}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      {getText('Display Order', 'प्रदर्शन क्रम', 'प्रदर्शन क्रम')} *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Category-specific fields */}
                  {activeCategory === 'city' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        {getText('State *', 'राज्य *', 'राज्य *')}
                      </label>
                      <select
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="">{getText('Select State', 'राज्य निवडा', 'राज्य निवडा')}</option>
                        {states.map((state) => (
                          <option key={state._id} value={state.key}>
                            {state.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {activeCategory === 'center' && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                          {getText('Address *', 'पत्ता *', 'पत्ता *')}
                        </label>
                        <textarea
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            resize: 'vertical'
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                            {getText('State *', 'राज्य *', 'राज्य *')}
                          </label>
                          <select
                            required
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          >
                            <option value="">{getText('Select State', 'राज्य निवडा', 'राज्य निवडा')}</option>
                            {states.map((state) => (
                              <option key={state._id} value={state.key}>
                                {state.value}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                            {getText('City *', 'शहर *', 'शहर *')}
                          </label>
                          <select
                            required
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            disabled={!formData.state}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none',
                              boxSizing: 'border-box',
                              opacity: !formData.state ? '0.5' : '1'
                            }}
                          >
                            <option value="">{getText('Select City', 'शहर निवडा', 'शहर निवडा')}</option>
                            {cities
                              .filter((city) => city.metadata?.state === formData.state)
                              .map((city) => (
                                <option key={city._id} value={city.key}>
                                  {city.value}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                            {getText('Zipcode *', 'पिनकोड *', 'पिनकोड *')}
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.zipcode}
                            onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                            {getText('Phone', 'फोन', 'फोन')}
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                          {getText('Email', 'ईमेल', 'ईमेल')}
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                          {getText('Timing *', 'वेळ *', 'वेळ *')}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.timing}
                          onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                          placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                          {getText('Google Map Link', 'गूगल मॅप लिंक', 'गूगल मॅप लिंक')}
                        </label>
                        <input
                          type="url"
                          value={formData.googleMapLink}
                          onChange={(e) => setFormData({ ...formData, googleMapLink: e.target.value })}
                          placeholder="https://maps.google.com/?q=..."
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </>
                  )}

                  {/* Metadata JSON field for other categories */}
                  {activeCategory !== 'city' && activeCategory !== 'center' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        {getText('Metadata (JSON)', 'मेटाडेटा (JSON)', 'मेटाडेटा (JSON)')}
                      </label>
                      <textarea
                        value={formData.metadata}
                        onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                        placeholder='{"key": "value"}'
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'monospace',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="isActive" style={{ fontSize: '14px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>
                      {getText('Active', 'सक्रिय', 'सक्रिय')}
                    </label>
                  </div>
                </div>

                {/* Modal Footer */}
                <div style={{
                  marginTop: '24px',
                  paddingTop: '24px',
                  borderTop: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: '12px 24px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    {getText('Cancel', 'रद्द करा', 'रद्द करा')}
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#f97316',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
                  >
                    {getText('Save', 'जतन करा', 'जतन करा')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MasterDataManagement;
