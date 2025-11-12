interface HRMSEmployeeData {
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: string;
    employeeCode?: string;
    department?: string;
    designation?: string;
}
export declare const hrmsService: {
    syncEmployeeData(employeeCode: string): Promise<HRMSEmployeeData | null>;
    searchEmployees(query: string): Promise<HRMSEmployeeData[]>;
    validateEmployeeCode(employeeCode: string): Promise<boolean>;
    getEmployeeByCode(employeeCode: string): Promise<HRMSEmployeeData | null>;
};
export {};
//# sourceMappingURL=hrmsService.d.ts.map