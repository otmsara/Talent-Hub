create table agree
(
    id            varchar(255) not null,
    activity_id   varchar(255),
    activity_type smallint check (activity_type between 0 and 1),
    created_at    timestamp(6),
    updated_at    timestamp(6),
    user_id       varchar(255),
    primary key (id)
);
create table comment
(
    id            varchar(255) not null,
    content       TEXT,
    created_at    timestamp(6),
    created_by_id varchar(255),
    deleted       boolean      not null,
    type          smallint check (type between 0 and 1),
    updated_at    timestamp(6),
    parent_id     varchar(255),
    post_id       varchar(255),
    primary key (id)
);
create table comment_media_ids
(
    comment_id varchar(255) not null,
    media_ids  varchar(255)
);
create table contribution
(
    id                    varchar(255) not null,
    content               varchar(255),
    created_at            timestamp(6),
    updated_at            timestamp(6),
    user_id               varchar(255),
    needed_contributor_id varchar(255),
    post_id               varchar(255),
    primary key (id)
);
create table contribution_attachments_ids
(
    contribution_id varchar(255) not null,
    attachments_ids varchar(255)
);
create table disagree
(
    id            varchar(255) not null,
    activity_id   varchar(255),
    activity_type smallint check (activity_type between 0 and 1),
    created_at    timestamp(6),
    updated_at    timestamp(6),
    user_id       varchar(255),
    primary key (id)
);
create table needed_contributor
(
    id         varchar(255) not null,
    created_at timestamp(6),
    job        varchar(255),
    updated_at timestamp(6),
    post_id    varchar(255),
    primary key (id)
);
create table outbox_event
(
    event_id       varchar(255) not null,
    aggregate_id   varchar(255) not null,
    aggregate_type varchar(100) not null,
    delivered      boolean      not null,
    event_type     varchar(100) not null,
    payload        text         not null,
    timestamp      timestamp(6),
    topic          varchar(255) not null,
    version        integer      not null,
    primary key (event_id)
);
create table post
(
    id                 varchar(255) not null,
    content            TEXT,
    created_at         timestamp(6),
    deleted            boolean      not null,
    is_networking_only boolean,
    link               varchar(255),
    posted_by_id       varchar(255),
    status             smallint check (status between 0 and 2),
    type               smallint check (type between 0 and 2),
    updated_at         timestamp(6),
    original_post_id   varchar(255),
    primary key (id)
);
create table post_media_ids
(
    post_id   varchar(255) not null,
    media_ids varchar(255)
);
create table report
(
    id             varchar(255) not null,
    created_at     timestamp(6),
    item_id        varchar(255),
    reason         varchar(255),
    report_type    smallint check (report_type between 0 and 1),
    reported_by_id varchar(255),
    updated_at     timestamp(6),
    primary key (id)
);
create index IDX3nojgsq16a6boxhc5px3dnp37 on agree (activity_id);
create index IDX9v38hb8britliye29xesyh1bk on report (item_id);
alter table if exists comment
    add constraint FKde3rfu96lep00br5ov0mdieyt foreign key (parent_id) references comment;
alter table if exists comment
    add constraint FKs1slvnkuemjsq2kj4h3vhx7i1 foreign key (post_id) references post;
alter table if exists comment_media_ids
    add constraint FKsct64rn7ayp7u9wx5pq9kloex foreign key (comment_id) references comment;
alter table if exists contribution
    add constraint FK7wrmt7xa08nwuvscifpb2p75w foreign key (needed_contributor_id) references needed_contributor;
alter table if exists contribution
    add constraint FKhw3085sbu0ep1gr1vv0rdqokn foreign key (post_id) references post;
alter table if exists contribution_attachments_ids
    add constraint FKswu07nqsuixqssnjgu7pcuemd foreign key (contribution_id) references contribution;
alter table if exists needed_contributor
    add constraint FK1nh5cwmpr7twsgjeahpv66pb9 foreign key (post_id) references post;
alter table if exists post
    add constraint FKlhngstwco4l1i3spswprvds0m foreign key (original_post_id) references post;
alter table if exists post_media_ids
    add constraint FKat5a58o5ly9414dlet4nfbbjs foreign key (post_id) references post