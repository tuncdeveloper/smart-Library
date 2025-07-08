package com.smart.smartLibraryWeb.dto.studentDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class StudentLoginResponseDTO {
    private Long id;
    private String message;
    private String username;
    private String email;
    private String fullName;
    private String department;
    private int grade;
    private String phone;



    // Getter'lar ve setter'lar
}

