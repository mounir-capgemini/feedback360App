package com.feedback360.mapper;

import com.feedback360.dto.UserDTO;
import com.feedback360.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper MapStruct pour la conversion User <-> UserDTO.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    UserDTO toDTO(User user);

    User toEntity(UserDTO userDTO);
}
