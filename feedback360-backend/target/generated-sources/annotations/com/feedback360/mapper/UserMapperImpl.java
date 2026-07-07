package com.feedback360.mapper;

import com.feedback360.dto.UserDTO;
import com.feedback360.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-07T01:52:01+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDTO toDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO.UserDTOBuilder userDTO = UserDTO.builder();

        userDTO.createdAt( user.getCreatedAt() );
        userDTO.email( user.getEmail() );
        userDTO.fullName( user.getFullName() );
        userDTO.id( user.getId() );
        userDTO.role( user.getRole() );
        userDTO.talentUpUserId( user.getTalentUpUserId() );

        return userDTO.build();
    }

    @Override
    public User toEntity(UserDTO userDTO) {
        if ( userDTO == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.createdAt( userDTO.getCreatedAt() );
        user.email( userDTO.getEmail() );
        user.fullName( userDTO.getFullName() );
        user.id( userDTO.getId() );
        user.role( userDTO.getRole() );
        user.talentUpUserId( userDTO.getTalentUpUserId() );

        return user.build();
    }
}
