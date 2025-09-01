package com.valhko.mediaservice.media.dto.response;

import com.valhko.common.client.media.util.MediaType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MediaDto {
    private String id;
    private String url;
    private MediaType type;
}
