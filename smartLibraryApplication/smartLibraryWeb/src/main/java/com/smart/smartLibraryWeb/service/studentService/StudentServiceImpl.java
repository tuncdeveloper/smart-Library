package com.smart.smartLibraryWeb.service.studentService;

import com.smart.smartLibraryWeb.dto.studentDTO.*;
import com.smart.smartLibraryWeb.exception.BadRequestException;
import com.smart.smartLibraryWeb.exception.ResourceNotFoundException;
import com.smart.smartLibraryWeb.mapper.studentMapper.StudentListMapper;
import com.smart.smartLibraryWeb.mapper.studentMapper.StudentRegisterMapper;
import com.smart.smartLibraryWeb.mapper.studentMapper.StudentUpdateMapper;
import com.smart.smartLibraryWeb.model.Student;
import com.smart.smartLibraryWeb.repository.StudentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final StudentListMapper studentListMapper;
    private final StudentRegisterMapper studentRegisterMapper;
    private final StudentUpdateMapper studentUpdateMapper;

    @Override
    public StudentLoginResponseDTO login(StudentLoginDTO loginDto) {
        Optional<Student> optionalStudent = studentRepository.findByUsername(loginDto.getUsername());

        if (optionalStudent.isPresent()) {
            Student student = optionalStudent.get();

            if (student.getPassword().equals(loginDto.getPassword())) {
                StudentLoginResponseDTO responseDTO = new StudentLoginResponseDTO();
                responseDTO.setMessage("Giriş başarılı");
                responseDTO.setId(student.getId());
                responseDTO.setUsername(student.getUsername());
                responseDTO.setEmail(student.getEmail());
                responseDTO.setFullName(student.getFullName());
                responseDTO.setDepartment(student.getDepartment());
                responseDTO.setGrade(student.getGrade());
                responseDTO.setPhone(student.getPhone());

                return responseDTO;
            } else {
                throw new BadRequestException("Şifre hatalı");
            }
        } else {
            throw new ResourceNotFoundException("Kullanıcı adı bulunamadı");
        }
    }


    @Override
    public void register(StudentRegisterDTO registerDto) {
        if (studentRepository.findByUsername(registerDto.getUsername()).isPresent()) {
            throw new BadRequestException("Kullanıcı adı zaten kayıtlı.");
        }
        if (studentRepository.findByEmail(registerDto.getEmail()).isPresent()) {
            throw new BadRequestException("Email zaten kayıtlı.");
        }

        Student student = studentRegisterMapper.mapToEntity(registerDto);
        studentRepository.save(student);
    }

    @Override
    public List<StudentListDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(studentListMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentListDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Öğrenci bulunamadı"));
        return studentListMapper.mapToDto(student);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Silinecek öğrenci bulunamadı");
        }
        studentRepository.deleteById(id);
    }




    public StudentUpdateDTO updateStudent(StudentUpdateDTO dto) {
        Student existingStudent = studentRepository.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + dto.getId()));

        studentUpdateMapper.updateStudentFromDto(dto, existingStudent); // 🔄 alanları kopyala

        Student updatedStudent = studentRepository.save(existingStudent);
        return studentUpdateMapper.mapToDto(updatedStudent);
    }

}
