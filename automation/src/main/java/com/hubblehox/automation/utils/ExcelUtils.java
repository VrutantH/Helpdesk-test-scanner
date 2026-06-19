package com.hubblehox.automation.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ExcelUtils {

    private static final String TESTDATA_PATH = ConfigReader.getTestDataPath();

    private ExcelUtils() {
    }

    // -------------------- READ --------------------

    public static String getCellValue(String fileName, String sheetName, int row, int col) {
        String filePath = TESTDATA_PATH + fileName;
        try (FileInputStream fis = new FileInputStream(filePath);
                Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheet(sheetName);
            Row rowData = sheet.getRow(row);
            if (rowData == null)
                return "";
            Cell cell = rowData.getCell(col);
            if (cell == null)
                return "";
            return getCellStringValue(cell);

        } catch (IOException e) {
            throw new RuntimeException("Failed to read Excel file: " + filePath, e);
        }
    }

    public static int getRowCount(String fileName, String sheetName) {
        String filePath = TESTDATA_PATH + fileName;
        try (FileInputStream fis = new FileInputStream(filePath);
                Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheet(sheetName);
            return sheet.getLastRowNum();

        } catch (IOException e) {
            throw new RuntimeException("Failed to read Excel file: " + filePath, e);
        }
    }

    // -------------------- WRITE RESULT --------------------

    public static void writeResult(String fileName, String sheetName, String tcId, String result) {
        String filePath = TESTDATA_PATH + fileName;
        try (FileInputStream fis = new FileInputStream(filePath);
                Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheet(sheetName);

            // Find or create the date-time column header in row 0
            Row headerRow = sheet.getRow(0);
            if (headerRow == null)
                headerRow = sheet.createRow(0);

            String currentRunTimestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yy HH:mm"));
            int resultColIndex = findOrCreateRunColumn(headerRow, currentRunTimestamp);

            // Find the row matching the TC ID
            int targetRow = findRowByTcId(sheet, tcId);
            if (targetRow == -1) {
                System.err.println("TC ID not found in Excel: " + tcId);
                return;
            }

            Row row = sheet.getRow(targetRow);
            if (row == null)
                row = sheet.createRow(targetRow);

            Cell resultCell = row.createCell(resultColIndex);
            resultCell.setCellValue(result);

            // Apply color styling
            CellStyle style = workbook.createCellStyle();
            if (result.startsWith("PASS")) {
                style.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
            } else {
                style.setFillForegroundColor(IndexedColors.ROSE.getIndex());
            }
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            resultCell.setCellStyle(style);

            try (FileOutputStream fos = new FileOutputStream(filePath)) {
                workbook.write(fos);
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to write result to Excel: " + filePath, e);
        }
    }

    // -------------------- HELPERS --------------------

    private static int findOrCreateRunColumn(Row headerRow, String timestamp) {
        // Check if this timestamp column already exists
        for (int i = AppConstants.COL_RESULTS_START; i <= headerRow.getLastCellNum(); i++) {
            Cell cell = headerRow.getCell(i);
            if (cell != null && timestamp.equals(getCellStringValue(cell))) {
                return i;
            }
        }
        // Create new column with timestamp
        int newColIndex = (headerRow.getLastCellNum() < AppConstants.COL_RESULTS_START)
                ? AppConstants.COL_RESULTS_START
                : headerRow.getLastCellNum();
        Cell headerCell = headerRow.createCell(newColIndex);
        headerCell.setCellValue(timestamp);
        return newColIndex;
    }

    private static int findRowByTcId(Sheet sheet, String tcId) {
        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null)
                continue;
            Cell cell = row.getCell(AppConstants.COL_TC_ID);
            if (cell != null && tcId.equalsIgnoreCase(getCellStringValue(cell))) {
                return i;
            }
        }
        return -1;
    }

    private static String getCellStringValue(Cell cell) {
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }
}
