Authentication Test Scenario Matrix

| ID | Category | Scenario Description | Expected Outcome | Status |
|---|---|---|---|---|
| TC-01 | Positive Case | Pendaftaran pengguna baru dengan data valid | HTTP 201 Created & Token dikembalikan | Passed |
| TC-02 | Negative Case | Login menggunakan kata sandi yang salah | HTTP 401 Unauthorized | Passed |
| TC-03 | Boundary Case | Pendaftaran dengan kata sandi < 8 karakter | HTTP 400 Bad Request | Passed |

Code Coverage Report Target
- Statements: > 80%
- Branches: > 80%
- Functions: > 80%
- Lines: > 80%
