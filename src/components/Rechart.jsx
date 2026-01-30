import React from 'react';
import {
    LayoutDashboard, Users, UserRound, CheckSquare, Calendar,
    BarChart3, Settings, LogOut, Bell, Search, Eye, Edit, Trash2,
    Plus, Filter, ChevronDown
} from 'lucide-react';

const Rechart = () => {
    const styles = {
        container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' },
        sidebar: { width: '260px', backgroundColor: '#0f172a', color: '#94a3b8', display: 'flex', flexDirection: 'column', padding: '24px 0', shrink: 0 },
        main: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
        header: { height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' },
        content: { padding: '32px' },
        navItem: (active) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', cursor: 'pointer',
            background: active ? 'linear-gradient(90deg, #f97316, #fb923c)' : 'transparent',
            color: active ? 'white' : '#94a3b8', borderRadius: active ? '0 50px 50px 0' : '0', marginRight: active ? '20px' : '0'
        }),
        searchBar: { display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 16px', flex: 1, marginRight: '16px' },
        filterBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: 'white', color: '#64748b', cursor: 'pointer' },
        addBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', fontWeight: '500' },
        card: { backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' },
        tableHeader: { textAlign: 'left', color: '#94a3b8', fontSize: '13px', fontWeight: '500', padding: '16px 24px', borderBottom: '1px solid #f1f5f9' },
        statusBadge: { padding: '4px 12px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }
    };

    return (
        <div style={styles.container}>
            {/* SIDEBAR */}
            <aside style={styles.sidebar}>
                <div style={{ padding: '0 24px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '35px', height: '35px', background: '#f97316', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold' }}>S</div>
                        <h1 style={{ color: 'white', margin: 0, fontSize: '20px' }}>SolstraInfo</h1>
                    </div>
                    <p style={{ fontSize: '10px', color: '#64748b', margin: '4px 0 0 45px', letterSpacing: '1px' }}>SUPER ADMIN CONTROL</p>
                </div>
                <nav style={{ flex: 1 }}>
                    <div style={styles.navItem(false)}><LayoutDashboard size={20} /> Dashboard</div>
                    <div style={styles.navItem(true)}><UserRound size={20} /> Mentor</div>
                    <div style={styles.navItem(false)}><Users size={20} /> Interns</div>
                    <div style={styles.navItem(false)}><CheckSquare size={20} /> Tasks</div>
                    <div style={styles.navItem(false)}><Calendar size={20} /> Attendance</div>
                    <div style={styles.navItem(false)}><BarChart3 size={20} /> Reports</div>
                </nav>
                <div style={{ padding: '24px', borderTop: '1px solid #1e293b' }}>
                    <div style={{ ...styles.navItem(false), padding: '8px 0' }}><Settings size={20} /> Settings</div>
                    <div style={{ ...styles.navItem(false), padding: '8px 0' }}><LogOut size={20} /> Logout</div>
                </div>
            </aside>

            
            <div style={styles.main}>
                <header style={styles.header}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Dashboard</h2>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Welcome back, Sarah. Here's what's happening today.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button style={styles.addBtn}><Plus size={18} /> Add Mentor</button>
                        <Bell size={20} color="#64748b" style={{ cursor: 'pointer' }} />
                        <div style={{ width: '35px', height: '35px', backgroundColor: '#3b82f6', borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '12px' }}>SI</div>
                    </div>
                </header>

                <main style={styles.content}>
                    
                    <div style={{ display: 'flex', marginBottom: '24px' }}>
                        <div style={styles.searchBar}>
                            <Search size={18} color="#94a3b8" style={{ marginRight: '10px' }} />
                            <input
                                type="text"
                                placeholder="Search by name, email..."
                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }}
                            />
                        </div>
                        <button style={styles.filterBtn}>
                            <Filter size={18} /> Filter
                        </button>
                    </div>

                
                    <div style={styles.card}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#fcfcfc' }}>
                                    <th style={styles.tableHeader}>Mentor Name</th>
                                    <th style={styles.tableHeader}>Assigned Interns</th>
                                    <th style={styles.tableHeader}>Status</th>
                                    <th style={styles.tableHeader}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <MentorRow name="Michael Roberts" email="michael.r@company.com" interns="52" image="https://i.pravatar.cc/150?u=1" />
                                <MentorRow name="James Miller" email="emma.t@company.com" interns="68" image="https://i.pravatar.cc/150?u=2" />
                                <MentorRow name="Lisa Wang" email="lisa.w@company.com" interns="45" image="https://i.pravatar.cc/150?u=3" />
                                <MentorRow name="David Kim" email="david.k@company.com" interns="34" image="https://i.pravatar.cc/150?u=4" />
                                <MentorRow name="David Kim" email="david.k@company.com" interns="77" image="https://i.pravatar.cc/150?u=5" />
                            </tbody>
                        </table>

                       
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderTop: '1px solid #f1f5f9' }}>
                            <button style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>Previous</button>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>Page 1 of 10</span>
                            <button style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>Next</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const MentorRow = ({ name, email, interns, image }) => (
    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
        <td style={{ padding: '16px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={image} alt={name} style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>{name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{email}</div>
                </div>
            </div>
        </td>
        <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>{interns}</td>
        <td style={{ padding: '16px 24px' }}>
            <span style={{ padding: '4px 12px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>Active</span>
        </td>
        <td style={{ padding: '16px 24px' }}>
            <div style={{ display: 'flex', gap: '12px', color: '#64748b' }}>
                <Eye size={18} style={{ cursor: 'pointer' }} />
                <Edit size={18} style={{ cursor: 'pointer', color: '#3b82f6' }} />
                <Trash2 size={18} style={{ cursor: 'pointer', color: '#ef4444' }} />
            </div>
        </td>
    </tr>
);

export default Rechart;
