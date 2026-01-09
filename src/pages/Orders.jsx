// src/pages/Orders.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
    Eye, 
    Edit, 
    Search, 
    Filter, 
    RefreshCw, 
    Package, 
    Clock, 
    CheckCircle, 
    Truck, 
    XCircle,
    ChevronDown,
    Calendar,
    DollarSign,
    User,
    MapPin,
    X,
    Send,
    CreditCard,
    AlertCircle,
    Loader,
    ExternalLink,
    ChevronLeft
} from 'lucide-react';
import '../assets/styles/Orders.css';


// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Order Status Options
const ORDER_STATUSES = [
    { value: 'PENDING', label: 'Pending', color: 'warning' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'info' },
    { value: 'PROCESSING', label: 'Processing', color: 'info' },
    { value: 'SHIPPED', label: 'Shipped', color: 'primary' },
    { value: 'DELIVERED', label: 'Delivered', color: 'success' },
    { value: 'COMPLETED', label: 'Completed', color: 'success' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'error' }
];

// Payment Status Options
const PAYMENT_STATUSES = [
    { value: 'PAY_ON_PICKUP', label: 'Pay on Pickup', color: 'warning' },
    { value: 'AWAITING_PAYMENT_LINK', label: 'Awaiting Link', color: 'warning' },
    { value: 'PAYMENT_LINK_SENT', label: 'Link Sent', color: 'info' },
    { value: 'PAID', label: 'Paid', color: 'success' }
];

// ==================== MODAL COMPONENT ====================
const Modal = ({ isOpen, onClose, title, subtitle, size = 'medium', children, footer }) => {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className={`modal-container modal-${size}`}>
                {/* Mobile Header with Back Button */}
                <div className="modal-header">
                    <button 
                        type="button"
                        className="modal-back-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="modal-title-wrapper">
                        <h2 className="modal-title">{title}</h2>
                        {subtitle && <span className="modal-subtitle">{subtitle}</span>}
                    </div>
                    <button 
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    {children}
                </div>

                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

// ==================== MAIN ORDERS COMPONENT ====================
const Orders = () => {
    // State
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    // Modal States
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDeliveryFeeModal, setShowDeliveryFeeModal] = useState(false);
    
    // Action States
    const [actionLoading, setActionLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [modalError, setModalError] = useState('');
    
    // Form States
    const [newStatus, setNewStatus] = useState('');
    const [statusNotes, setStatusNotes] = useState('');
    const [paymentLink, setPaymentLink] = useState('');
    const [deliveryFee, setDeliveryFee] = useState('');

    // ==================== API CALLS ====================

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        
        try {
            let url = `${API_BASE_URL}/orders/admin/all`;
            const params = new URLSearchParams();
            
            if (statusFilter) params.append('status', statusFilter);
            if (paymentFilter) params.append('paymentStatus', paymentFilter);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/admin/${orderId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }

            const data = await response.json();
            setSelectedOrder(data);
            return data;
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Failed to load order details.');
            return null;
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder || !newStatus) {
            setModalError('Please select a status');
            return;
        }

        setActionLoading(true);
        setModalError('');

        try {
            const response = await fetch(
                `${API_BASE_URL}/orders/admin/${selectedOrder.id}/status`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        status: newStatus,
                        notes: statusNotes 
                    })
                }
            );

            const result = await response.json();

            if (result.success) {
                showSuccess('Order status updated successfully!');
                closeAllModals();
                fetchOrders();
            } else {
                setModalError(result.message || 'Failed to update status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            setModalError('Failed to update order status. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSendPaymentLink = async () => {
        if (!selectedOrder || !paymentLink.trim()) {
            setModalError('Please enter a payment link');
            return;
        }

        try {
            new URL(paymentLink);
        } catch {
            setModalError('Please enter a valid URL');
            return;
        }

        setActionLoading(true);
        setModalError('');

        try {
            const response = await fetch(
                `${API_BASE_URL}/orders/admin/${selectedOrder.id}/payment-link`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentLink: paymentLink.trim() })
                }
            );

            const result = await response.json();

            if (result.success) {
                showSuccess('Payment link sent successfully!');
                closeAllModals();
                fetchOrders();
            } else {
                setModalError(result.message || 'Failed to send payment link');
            }
        } catch (err) {
            console.error('Error sending payment link:', err);
            setModalError('Failed to send payment link. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateDeliveryFee = async () => {
        if (!selectedOrder) return;

        const feeValue = parseFloat(deliveryFee);
        if (isNaN(feeValue) || feeValue < 0) {
            setModalError('Please enter a valid delivery fee');
            return;
        }

        setActionLoading(true);
        setModalError('');

        try {
            const response = await fetch(
                `${API_BASE_URL}/orders/admin/${selectedOrder.id}/delivery-fee`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ deliveryFee: feeValue })
                }
            );

            const result = await response.json();

            if (result.success) {
                showSuccess('Delivery fee updated successfully!');
                closeAllModals();
                fetchOrders();
            } else {
                setModalError(result.message || 'Failed to update delivery fee');
            }
        } catch (err) {
            console.error('Error updating delivery fee:', err);
            setModalError('Failed to update delivery fee. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // ==================== MODAL HANDLERS ====================

    const closeAllModals = useCallback(() => {
        setShowOrderModal(false);
        setShowStatusModal(false);
        setShowPaymentModal(false);
        setShowDeliveryFeeModal(false);
        setModalError('');
        setNewStatus('');
        setStatusNotes('');
        setPaymentLink('');
        setDeliveryFee('');
    }, []);

    const openOrderDetails = async (orderId) => {
        const order = await fetchOrderDetails(orderId);
        if (order) {
            setShowOrderModal(true);
        }
    };

    const openStatusModal = () => {
        if (selectedOrder) {
            setNewStatus(selectedOrder.orderStatus);
        }
        setStatusNotes('');
        setModalError('');
        setShowStatusModal(true);
    };

    const openPaymentModal = () => {
        setPaymentLink('');
        setModalError('');
        setShowPaymentModal(true);
    };

    const openDeliveryFeeModal = () => {
        setDeliveryFee(selectedOrder?.deliveryFee?.toString() || '');
        setModalError('');
        setShowDeliveryFeeModal(true);
    };

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 4000);
    };

    // ==================== EFFECTS ====================

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, paymentFilter]);

    // ==================== HELPERS ====================

    const filteredOrders = orders.filter(order => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            order.orderNumber?.toLowerCase().includes(search) ||
            order.customerName?.toLowerCase().includes(search) ||
            order.customerEmail?.toLowerCase().includes(search) ||
            order.customerPhone?.includes(searchTerm)
        );
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(price || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusInfo = (status, type = 'order') => {
        const statuses = type === 'order' ? ORDER_STATUSES : PAYMENT_STATUSES;
        return statuses.find(s => s.value === status) || { label: status, color: 'default' };
    };

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.orderStatus === 'PENDING').length,
        processing: orders.filter(o => ['CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(o.orderStatus)).length,
        completed: orders.filter(o => ['DELIVERED', 'COMPLETED'].includes(o.orderStatus)).length,
        revenue: orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    };

    // ==================== RENDER ====================

    return (
        <div className="orders-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">
                        <Package size={28} />
                        Orders
                    </h1>
                    <p className="page-subtitle">Manage customer orders</p>
                </div>
                <button 
                    className="btn-refresh" 
                    onClick={fetchOrders} 
                    disabled={loading}
                    type="button"
                >
                    <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                    <span className="btn-text">Refresh</span>
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="alert alert-success">
                    <CheckCircle size={20} />
                    <span>{successMessage}</span>
                    <button type="button" onClick={() => setSuccessMessage('')}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="alert alert-error">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    <button type="button" onClick={() => setError('')}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon total"><Package size={22} /></div>
                    <div className="stat-info">
                        <h3>{stats.total}</h3>
                        <p>Total</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon pending"><Clock size={22} /></div>
                    <div className="stat-info">
                        <h3>{stats.pending}</h3>
                        <p>Pending</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon processing"><Truck size={22} /></div>
                    <div className="stat-info">
                        <h3>{stats.processing}</h3>
                        <p>Processing</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon completed"><CheckCircle size={22} /></div>
                    <div className="stat-info">
                        <h3>{stats.completed}</h3>
                        <p>Completed</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button 
                            type="button"
                            className="clear-search" 
                            onClick={() => setSearchTerm('')}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
                <button 
                    type="button"
                    className={`btn-filter ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter size={18} />
                    <span className="btn-text">Filter</span>
                    {(statusFilter || paymentFilter) && <span className="filter-dot"></span>}
                </button>
            </div>

            {showFilters && (
                <div className="filter-options">
                    <div className="filter-group">
                        <label>Order Status</label>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            {ORDER_STATUSES.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Payment Status</label>
                        <select 
                            value={paymentFilter} 
                            onChange={(e) => setPaymentFilter(e.target.value)}
                        >
                            <option value="">All Payments</option>
                            {PAYMENT_STATUSES.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    {(statusFilter || paymentFilter) && (
                        <button 
                            type="button"
                            className="btn-clear-filters"
                            onClick={() => { setStatusFilter(''); setPaymentFilter(''); }}
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}

            {/* Orders List */}
            <div className="orders-container">
                {loading ? (
                    <div className="loading-state">
                        <Loader size={36} className="spinning" />
                        <p>Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="empty-state">
                        <Package size={48} />
                        <h3>No orders found</h3>
                        <p>
                            {searchTerm || statusFilter || paymentFilter 
                                ? 'Try adjusting your filters' 
                                : 'Orders will appear here'}
                        </p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {filteredOrders.map(order => (
                            <div 
                                key={order.id} 
                                className="order-card"
                                onClick={() => openOrderDetails(order.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && openOrderDetails(order.id)}
                            >
                                <div className="order-card-header">
                                    <div className="order-id">{order.orderNumber}</div>
                                    <span className={`status-badge ${getStatusInfo(order.orderStatus).color}`}>
                                        {getStatusInfo(order.orderStatus).label}
                                    </span>
                                </div>
                                
                                <div className="order-card-body">
                                    <div className="order-info-row">
                                        <User size={14} />
                                        <span>{order.customerName}</span>
                                    </div>
                                    <div className="order-info-row">
                                        <Calendar size={14} />
                                        <span>{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className="order-info-row">
                                        <MapPin size={14} />
                                        <span>
                                            {order.deliveryType === 'PICKUP' ? 'Store Pickup' : order.city || 'Delivery'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="order-card-footer">
                                    <div className="order-amount">{formatPrice(order.totalAmount)}</div>
                                    <span className={`status-badge small ${getStatusInfo(order.paymentStatus, 'payment').color}`}>
                                        {getStatusInfo(order.paymentStatus, 'payment').label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ==================== MODALS ==================== */}

            {/* Order Details Modal */}
            <Modal
                isOpen={showOrderModal && selectedOrder !== null}
                onClose={() => setShowOrderModal(false)}
                title="Order Details"
                subtitle={selectedOrder?.orderNumber}
                size="large"
                footer={
                    <div className="modal-actions">
                        <button 
                            type="button"
                            className="btn btn-outline full-width-mobile"
                            onClick={() => setShowOrderModal(false)}
                        >
                            Close
                        </button>
                        <button 
                            type="button"
                            className="btn btn-primary"
                            onClick={openStatusModal}
                        >
                            <Edit size={16} /> Update Status
                        </button>
                        {selectedOrder?.deliveryType === 'DELIVERY' && (
                            <>
                                <button 
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={openDeliveryFeeModal}
                                >
                                    <Truck size={16} /> Delivery Fee
                                </button>
                                {selectedOrder?.paymentStatus === 'AWAITING_PAYMENT_LINK' && (
                                    <button 
                                        type="button"
                                        className="btn btn-success"
                                        onClick={openPaymentModal}
                                    >
                                        <Send size={16} /> Payment Link
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                }
            >
                {selectedOrder && (
                    <>
                        {/* Status Badges */}
                        <div className="detail-badges">
                            <span className={`status-badge ${getStatusInfo(selectedOrder.orderStatus).color}`}>
                                {getStatusInfo(selectedOrder.orderStatus).label}
                            </span>
                            <span className={`status-badge ${getStatusInfo(selectedOrder.paymentStatus, 'payment').color}`}>
                                {getStatusInfo(selectedOrder.paymentStatus, 'payment').label}
                            </span>
                        </div>

                        {/* Customer Section */}
                        <div className="detail-section">
                            <h4><User size={16} /> Customer Information</h4>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Name</span>
                                    <span className="detail-value">
                                        {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Email</span>
                                    <span className="detail-value">{selectedOrder.customer?.email}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Phone</span>
                                    <span className="detail-value">{selectedOrder.customer?.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Section */}
                        <div className="detail-section">
                            <h4><MapPin size={16} /> Delivery Information</h4>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Method</span>
                                    <span className="detail-value">
                                        {selectedOrder.deliveryType === 'PICKUP' ? '🏪 Store Pickup' : '🚚 Home Delivery'}
                                    </span>
                                </div>
                                {selectedOrder.deliveryType === 'DELIVERY' && (
                                    <>
                                        <div className="detail-item full-width">
                                            <span className="detail-label">Address</span>
                                            <span className="detail-value">
                                                {selectedOrder.deliveryAddress}, {selectedOrder.city}
                                                {selectedOrder.region && `, ${selectedOrder.region}`}
                                            </span>
                                        </div>
                                        {selectedOrder.deliveryNotes && (
                                            <div className="detail-item full-width">
                                                <span className="detail-label">Notes</span>
                                                <span className="detail-value">{selectedOrder.deliveryNotes}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="detail-section">
                            <h4><Package size={16} /> Order Items ({selectedOrder.items?.length || 0})</h4>
                            <div className="items-list">
                                {selectedOrder.items?.map(item => (
                                    <div key={item.id} className="item-row">
                                        <img 
                                            src={item.productImage || '/placeholder.png'} 
                                            alt={item.productName}
                                            onError={(e) => { e.target.src = '/placeholder.png'; }}
                                        />
                                        <div className="item-details">
                                            <span className="item-name">{item.productName}</span>
                                            <span className="item-meta">
                                                Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                                            </span>
                                        </div>
                                        <span className="item-total">{formatPrice(item.totalPrice)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="detail-section">
                            <h4><DollarSign size={16} /> Pricing Summary</h4>
                            <div className="pricing-box">
                                <div className="pricing-row">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                                </div>
                                <div className="pricing-row">
                                    <span>Delivery Fee</span>
                                    <span>
                                        {selectedOrder.deliveryFee > 0 
                                            ? formatPrice(selectedOrder.deliveryFee)
                                            : selectedOrder.deliveryType === 'PICKUP' 
                                                ? 'Free' 
                                                : 'Not set'
                                        }
                                    </span>
                                </div>
                                <div className="pricing-row total">
                                    <span>Total</span>
                                    <span>{formatPrice(selectedOrder.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Link */}
                        {selectedOrder.paymentLink && (
                            <div className="detail-section">
                                <h4><CreditCard size={16} /> Payment Link</h4>
                                <a 
                                    href={selectedOrder.paymentLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="payment-link-display"
                                >
                                    {selectedOrder.paymentLink}
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="detail-section">
                            <div className="timestamps">
                                <span>Created: {formatDate(selectedOrder.createdAt)}</span>
                                {selectedOrder.paidAt && (
                                    <span>Paid: {formatDate(selectedOrder.paidAt)}</span>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </Modal>

            {/* Update Status Modal */}
            <Modal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Update Status"
                subtitle={selectedOrder?.orderNumber}
                size="small"
                footer={
                    <div className="modal-actions">
                        <button 
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setShowStatusModal(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            className="btn btn-primary"
                            onClick={handleUpdateStatus}
                            disabled={actionLoading || !newStatus || newStatus === selectedOrder?.orderStatus}
                        >
                            {actionLoading ? (
                                <><Loader size={16} className="spinning" /> Updating...</>
                            ) : (
                                'Update'
                            )}
                        </button>
                    </div>
                }
            >
                {/* Current Status */}
                <div className="current-status-display">
                    <span>Current:</span>
                    <span className={`status-badge ${getStatusInfo(selectedOrder?.orderStatus).color}`}>
                        {getStatusInfo(selectedOrder?.orderStatus).label}
                    </span>
                </div>

                {/* Status Select */}
                <div className="form-group">
                    <label htmlFor="status-select">New Status</label>
                    <select 
                        id="status-select"
                        value={newStatus} 
                        onChange={(e) => setNewStatus(e.target.value)}
                    >
                        <option value="">Select status...</option>
                        {ORDER_STATUSES.map(status => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Notes */}
                <div className="form-group">
                    <label htmlFor="status-notes">Notes (Optional)</label>
                    <textarea
                        id="status-notes"
                        value={statusNotes}
                        onChange={(e) => setStatusNotes(e.target.value)}
                        placeholder="Add notes about this update..."
                        rows={3}
                    />
                </div>

                {/* Error */}
                {modalError && (
                    <div className="modal-error">
                        <AlertCircle size={16} />
                        <span>{modalError}</span>
                    </div>
                )}
            </Modal>

            {/* Send Payment Link Modal */}
            <Modal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                title="Send Payment Link"
                subtitle={selectedOrder?.orderNumber}
                size="small"
                footer={
                    <div className="modal-actions">
                        <button 
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setShowPaymentModal(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            className="btn btn-success"
                            onClick={handleSendPaymentLink}
                            disabled={actionLoading || !paymentLink.trim()}
                        >
                            {actionLoading ? (
                                <><Loader size={16} className="spinning" /> Sending...</>
                            ) : (
                                <><Send size={16} /> Send</>
                            )}
                        </button>
                    </div>
                }
            >
                <div className="modal-info-box">
                    <p>Amount: <strong>{formatPrice(selectedOrder?.totalAmount)}</strong></p>
                    <p>Customer: <strong>{selectedOrder?.customer?.email}</strong></p>
                </div>

                <div className="form-group">
                    <label htmlFor="payment-link">Payment Link URL</label>
                    <input
                        id="payment-link"
                        type="url"
                        value={paymentLink}
                        onChange={(e) => setPaymentLink(e.target.value)}
                        placeholder="https://paystack.com/pay/..."
                    />
                </div>

                {modalError && (
                    <div className="modal-error">
                        <AlertCircle size={16} />
                        <span>{modalError}</span>
                    </div>
                )}
            </Modal>

            {/* Delivery Fee Modal */}
            <Modal
                isOpen={showDeliveryFeeModal}
                onClose={() => setShowDeliveryFeeModal(false)}
                title="Set Delivery Fee"
                subtitle={selectedOrder?.orderNumber}
                size="small"
                footer={
                    <div className="modal-actions">
                        <button 
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setShowDeliveryFeeModal(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            className="btn btn-primary"
                            onClick={handleUpdateDeliveryFee}
                            disabled={actionLoading || deliveryFee === '' || parseFloat(deliveryFee) < 0}
                        >
                            {actionLoading ? (
                                <><Loader size={16} className="spinning" /> Updating...</>
                            ) : (
                                'Update'
                            )}
                        </button>
                    </div>
                }
            >
                <div className="modal-info-box">
                    <p>Delivery to: <strong>{selectedOrder?.city}</strong></p>
                </div>

                <div className="form-group">
                    <label htmlFor="delivery-fee">Delivery Fee (₦)</label>
                    <input
                        id="delivery-fee"
                        type="number"
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(e.target.value)}
                        placeholder="Enter amount"
                        min="0"
                        step="100"
                    />
                </div>

                {deliveryFee && parseFloat(deliveryFee) >= 0 && (
                    <div className="fee-preview">
                        <div className="fee-row">
                            <span>Subtotal:</span>
                            <span>{formatPrice(selectedOrder?.subtotal)}</span>
                        </div>
                        <div className="fee-row">
                            <span>Delivery:</span>
                            <span>{formatPrice(parseFloat(deliveryFee))}</span>
                        </div>
                        <div className="fee-row total">
                            <span>New Total:</span>
                            <span>{formatPrice((selectedOrder?.subtotal || 0) + parseFloat(deliveryFee))}</span>
                        </div>
                    </div>
                )}

                {modalError && (
                    <div className="modal-error">
                        <AlertCircle size={16} />
                        <span>{modalError}</span>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Orders;