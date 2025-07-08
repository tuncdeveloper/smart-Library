package com.smart.smartLibraryWeb.mapper.studentMapper;

import com.smart.smartLibraryWeb.dto.studentDTO.StudentLoginResponseDTO;
import com.smart.smartLibraryWeb.mapper.BaseMapper;
import com.smart.smartLibraryWeb.model.Student;

public interface StudentLoginResponseMapper extends BaseMapper<Student, StudentLoginResponseDTO> {

    @Override
    StudentLoginResponseDTO mapToDto(Student entity);

    @Override
    Student mapToEntity(StudentLoginResponseDTO dto);
}
