export const getPriorityStyle = (priority: string) => {    
    switch (priority) {
      case 'high':
        return { backgroundColor: '#ff4d4f' };
      case 'medium':
        return { backgroundColor: '#faad14' };
      default:
        return { backgroundColor: '#52c41a' };
    }
  };
  
  export const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return { backgroundColor: '#1890ff' };
      default:
        return { backgroundColor: '#999' };
    }
  };