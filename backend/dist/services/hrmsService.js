"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hrmsService = void 0;
const mockEmployees = [
    {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@sac.gov.in',
        mobile: '9876543210',
        employeeCode: 'EMP001',
        department: 'ICT',
        designation: 'District Coordinator ICT'
    },
    {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@sac.gov.in',
        mobile: '9876543211',
        employeeCode: 'EMP002',
        department: 'ICT',
        designation: 'District Coordinator ICT'
    },
    {
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'amit.patel@sac.gov.in',
        mobile: '9876543212',
        employeeCode: 'EMP003',
        department: 'Administration',
        designation: 'System Administrator'
    },
    {
        firstName: 'Sneha',
        lastName: 'Deshmukh',
        email: 'sneha.deshmukh@sac.gov.in',
        mobile: '9876543213',
        employeeCode: 'EMP004',
        department: 'ICT',
        designation: 'Technical Support Engineer'
    },
    {
        firstName: 'Vikram',
        lastName: 'Singh',
        email: 'vikram.singh@sac.gov.in',
        mobile: '9876543214',
        employeeCode: 'EMP005',
        department: 'Operations',
        designation: 'District Coordinator Operations'
    },
    {
        firstName: 'Anjali',
        lastName: 'Mehta',
        email: 'anjali.mehta@sac.gov.in',
        mobile: '9876543215',
        employeeCode: 'EMP006',
        department: 'ICT',
        designation: 'District Coordinator ICT'
    },
    {
        firstName: 'Rahul',
        lastName: 'Joshi',
        email: 'rahul.joshi@sac.gov.in',
        mobile: '9876543216',
        employeeCode: 'EMP007',
        department: 'Support',
        designation: 'Help Desk Executive'
    },
    {
        firstName: 'Kavita',
        lastName: 'Reddy',
        email: 'kavita.reddy@sac.gov.in',
        mobile: '9876543217',
        employeeCode: 'EMP008',
        department: 'ICT',
        designation: 'District Coordinator ICT'
    },
    {
        firstName: 'Suresh',
        lastName: 'Nair',
        email: 'suresh.nair@sac.gov.in',
        mobile: '9876543218',
        employeeCode: 'EMP009',
        department: 'Management',
        designation: 'Project Manager'
    },
    {
        firstName: 'Deepa',
        lastName: 'Rao',
        email: 'deepa.rao@sac.gov.in',
        mobile: '9876543219',
        employeeCode: 'EMP010',
        department: 'ICT',
        designation: 'Senior District Coordinator ICT'
    }
];
exports.hrmsService = {
    async syncEmployeeData(employeeCode) {
        console.log('HRMS Service: syncEmployeeData called for:', employeeCode);
        const employee = mockEmployees.find(emp => emp.employeeCode?.toLowerCase() === employeeCode.toLowerCase());
        return employee || null;
    },
    async searchEmployees(query) {
        console.log('HRMS Service: searchEmployees called with query:', query);
        if (!query || query.trim().length < 2) {
            return [];
        }
        const searchTerm = query.toLowerCase();
        const results = mockEmployees.filter(emp => emp.firstName?.toLowerCase().includes(searchTerm) ||
            emp.lastName?.toLowerCase().includes(searchTerm) ||
            emp.email?.toLowerCase().includes(searchTerm) ||
            emp.mobile?.includes(searchTerm) ||
            emp.employeeCode?.toLowerCase().includes(searchTerm) ||
            emp.department?.toLowerCase().includes(searchTerm) ||
            emp.designation?.toLowerCase().includes(searchTerm));
        console.log(`Found ${results.length} results for query: "${query}"`);
        return results;
    },
    async validateEmployeeCode(employeeCode) {
        console.log('HRMS Service: validateEmployeeCode called for:', employeeCode);
        const exists = mockEmployees.some(emp => emp.employeeCode?.toLowerCase() === employeeCode.toLowerCase());
        return exists;
    },
    async getEmployeeByCode(employeeCode) {
        console.log('HRMS Service: getEmployeeByCode called for:', employeeCode);
        const employee = mockEmployees.find(emp => emp.employeeCode?.toLowerCase() === employeeCode.toLowerCase());
        return employee || null;
    }
};
//# sourceMappingURL=hrmsService.js.map