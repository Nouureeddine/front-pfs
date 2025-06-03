// src/scenes/Dashboard/data/mockData.js
export const stats = [
    { title: "Total Audits", value: "24", change: "+3%", trend: "up" },
    { title: "Completed", value: "18", change: "+10%", trend: "up" },
    { title: "In Progress", value: "5", change: "-2%", trend: "down" },
    { title: "Critical Issues", value: "7", change: "+1%", trend: "up" },
    { title: "Critical Issues", value: "7", change: "+1%", trend: "up" }

  ];
  
  export const recentAudits = [
    { id: 1, name: "AWS Compliance", date: "2023-05-15", status: "Completed" },
    { id: 2, name: "GDPR Review", date: "2023-05-18", status: "In Progress" },
    { id: 3, name: "ISO 27001", date: "2023-05-20", status: "Pending" },
    { id: 3, name: "ISO 27001", date: "2023-05-20", status: "Pending" }

  ];
  
  export const auditMetrics = [
    { name: "AWS Compliance", date: "2023-05-15", violations: 5, score: 92 },
    { name: "GDPR Review", date: "2023-05-18", violations: 12, score: 78 },
    { name: "ISO 27001", date: "2023-05-20", violations: 8, score: 85 }
  ];
  