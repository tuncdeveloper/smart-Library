package com.smart.smartLibraryWeb.dto.studentDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class StudentUpdateDTO {

    private Long id;

    private String username;

    private String password;

    private String email;

    private String fullName;

    private String department;

    private Integer grade;

    private String phone;

    // password güncelleme ayrı DTO veya endpoint ile yapılabilir.

}

