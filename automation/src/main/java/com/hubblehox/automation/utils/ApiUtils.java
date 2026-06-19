package com.hubblehox.automation.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.io.entity.StringEntity;

import java.io.IOException;

/**
 * Handles API-based authentication.
 * Used for non-login test cases to inject token directly into browser
 * localStorage
 * instead of going through the UI login flow every time.
 */
public class ApiUtils {

    private static final String LOGIN_ENDPOINT = "/api/auth/login";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private ApiUtils() {
    }

    /**
     * Calls the backend login API and returns the JWT token.
     * 
     * @param email    user email
     * @param password user password
     * @return JWT token string
     */
    public static String getAuthToken(String email, String password) {
        String url = ConfigReader.getBaseUrl() + LOGIN_ENDPOINT;

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(url);
            request.setHeader("Content-Type", "application/json");

            String requestBody = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
            request.setEntity(new StringEntity(requestBody, ContentType.APPLICATION_JSON));

            return httpClient.execute(request, response -> {
                String responseBody = new String(response.getEntity().getContent().readAllBytes());
                JsonNode json = objectMapper.readTree(responseBody);

                if (json.has("token")) {
                    return json.get("token").asText();
                }
                throw new RuntimeException("Token not found in login response. Response: " + responseBody);
            });

        } catch (IOException e) {
            throw new RuntimeException("API login failed for user: " + email, e);
        }
    }

    /**
     * Injects the JWT token into browser localStorage.
     * Call this in @BeforeMethod for non-login test classes.
     *
     * Usage in test:
     * String token = ApiUtils.getAuthToken(email, password);
     * ApiUtils.injectToken(driver, token);
     * driver.navigate().refresh();
     */
    public static void injectToken(org.openqa.selenium.WebDriver driver, String token) {
        org.openqa.selenium.JavascriptExecutor js = (org.openqa.selenium.JavascriptExecutor) driver;
        js.executeScript("window.localStorage.setItem('authToken', arguments[0]);", token);
    }
}
