'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import styles from './ToastContainer.module.css';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => {
        let Icon = Info;
        let toastClass = styles.info;

        if (toast.type === 'success') {
          Icon = CheckCircle;
          toastClass = styles.success;
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          toastClass = styles.error;
        }

        return (
          <div key={toast.id} className={`${styles.toast} ${toastClass}`}>
            <div className={styles.iconWrapper}>
              <Icon size={18} />
            </div>
            <div className={styles.message}>{toast.message}</div>
            <button
              onClick={() => dismissToast(toast.id)}
              className={styles.closeButton}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
