package com.hubblehox.automation.utils;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;

import java.io.FileInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class GoogleSheetsUtils {

    private static Sheets sheetsService;
    private static String currentRunTimestamp;

    private GoogleSheetsUtils() {
    }

    // -------------------- INIT --------------------

    private static Sheets getSheetsService() {
        if (sheetsService == null) {
            try {
                GoogleCredentials credentials = ServiceAccountCredentials
                        .fromStream(new FileInputStream(ConfigReader.getGoogleCredentialsPath()))
                        .createScoped(Arrays.asList(AppConstants.SHEETS_SCOPE, AppConstants.DRIVE_SCOPE));

                sheetsService = new Sheets.Builder(
                        GoogleNetHttpTransport.newTrustedTransport(),
                        GsonFactory.getDefaultInstance(),
                        new HttpCredentialsAdapter(credentials))
                        .setApplicationName("HubbleHox Automation")
                        .build();
            } catch (Exception e) {
                throw new RuntimeException("Failed to initialize Google Sheets service", e);
            }
        }
        return sheetsService;
    }

    private static String getRunTimestamp() {
        if (currentRunTimestamp == null) {
            currentRunTimestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("dd-MM-yy HH:mm"));
        }
        return currentRunTimestamp;
    }

    // -------------------- WRITE RESULT --------------------

    public static void writeResult(String module, String tcId, String result) {
        try {
            String sheetId = ConfigReader.getSheetId(module);
            String tabName = ConfigReader.getSheetTabName(module);
            Sheets service = getSheetsService();

            // Read current header row to find/create run column
            String headerRange = tabName + "!1:1";
            ValueRange headerRow = service.spreadsheets().values()
                    .get(sheetId, headerRange).execute();

            List<Object> headers = new ArrayList<>();
            if (headerRow.getValues() != null && !headerRow.getValues().isEmpty()) {
                headers = headerRow.getValues().get(0);
            }

            String timestamp = getRunTimestamp();
            int resultColIndex = findOrCreateColumn(service, sheetId, tabName, headers, timestamp);

            // Find the row index for this TC ID
            String dataRange = tabName + "!A:A";
            ValueRange tcColumn = service.spreadsheets().values()
                    .get(sheetId, dataRange).execute();

            int targetRow = findRowByTcId(tcColumn, tcId);
            if (targetRow == -1) {
                System.err.println("TC ID not found in Google Sheet: " + tcId);
                return;
            }

            // Write result to the correct cell
            String cellAddress = tabName + "!" + columnIndexToLetter(resultColIndex) + targetRow;
            ValueRange body = new ValueRange().setValues(List.of(List.of(result)));
            service.spreadsheets().values()
                    .update(sheetId, cellAddress, body)
                    .setValueInputOption("RAW")
                    .execute();

        } catch (IOException e) {
            System.err.println("Failed to write result to Google Sheet for " + tcId + ": " + e.getMessage());
        }
    }

    // -------------------- HELPERS --------------------

    private static int findOrCreateColumn(Sheets service, String sheetId, String tabName,
            List<Object> headers, String timestamp) throws IOException {
        for (int i = AppConstants.COL_RESULTS_START; i < headers.size(); i++) {
            if (timestamp.equals(String.valueOf(headers.get(i)))) {
                return i + 1; // Sheets API is 1-based
            }
        }
        // Not found — create new column header
        int newColIndex = Math.max(headers.size(), AppConstants.COL_RESULTS_START);
        String cellAddress = tabName + "!" + columnIndexToLetter(newColIndex + 1) + "1";
        ValueRange body = new ValueRange().setValues(List.of(List.of(timestamp)));
        service.spreadsheets().values()
                .update(sheetId, cellAddress, body)
                .setValueInputOption("RAW")
                .execute();
        return newColIndex + 1;
    }

    private static int findRowByTcId(ValueRange tcColumn, String tcId) {
        if (tcColumn.getValues() == null)
            return -1;
        List<List<Object>> rows = tcColumn.getValues();
        for (int i = 1; i < rows.size(); i++) {
            List<Object> row = rows.get(i);
            if (!row.isEmpty() && tcId.equalsIgnoreCase(String.valueOf(row.get(0)))) {
                return i + 1; // Sheets rows are 1-based
            }
        }
        return -1;
    }

    private static String columnIndexToLetter(int colIndex) {
        StringBuilder letter = new StringBuilder();
        while (colIndex > 0) {
            int remainder = (colIndex - 1) % 26;
            letter.insert(0, (char) (remainder + 'A'));
            colIndex = (colIndex - 1) / 26;
        }
        return letter.toString();
    }
}
