package com.lumera.dto;

import jakarta.validation.constraints.NotBlank;

public class CheckPasswordRequest {

    @NotBlank
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
