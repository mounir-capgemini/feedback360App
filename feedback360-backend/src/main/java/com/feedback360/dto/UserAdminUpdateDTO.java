package com.feedback360.dto;

import com.feedback360.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAdminUpdateDTO {

    private Role role;
    private Boolean enabled;
}
