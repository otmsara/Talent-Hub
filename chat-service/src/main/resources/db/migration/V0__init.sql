create table conversation
(
    id         varchar(255) not null,
    created_at timestamp(6),
    type       smallint check (type between 0 and 2),
    updated_at timestamp(6),
    primary key (id)
);
create table member
(
    id              varchar(255) not null,
    created_at      timestamp(6),
    role            smallint check (role between 0 and 1),
    updated_at      timestamp(6),
    user_id         varchar(255),
    conversation_id varchar(255),
    primary key (id)
);
create table message
(
    id              varchar(255) not null,
    created_at      timestamp(6),
    deleted         boolean      not null,
    media           varchar(255),
    message         varchar(255),
    updated_at      timestamp(6),
    conversation_id varchar(255),
    sender_id       varchar(255),
    primary key (id)
);
create table message_read_status
(
    id         varchar(255) not null,
    read_at    timestamp(6),
    user_id    varchar(255),
    message_id varchar(255),
    primary key (id)
);
create index IDXq142b0ea3ls5vcl0smgtg1mnx on member (user_id);
create index IDXt17yb33v0cyimmnuiniqgmrqy on message_read_status (user_id);
create index IDXfcxwydc21krs1odt74785o0to on message_read_status (message_id);
alter table if exists message_read_status
    drop constraint if exists UKfh8v5vvwq60je45ulwkr73808;
alter table if exists message_read_status
    add constraint UKfh8v5vvwq60je45ulwkr73808 unique (user_id, message_id);
alter table if exists member
    add constraint FK2m6rh88h9lqanm2anb5g1vi4t foreign key (conversation_id) references conversation;
alter table if exists message
    add constraint FK6yskk3hxw5sklwgi25y6d5u1l foreign key (conversation_id) references conversation;
alter table if exists message
    add constraint FKt23a3aa8rhuah50164n3syecy foreign key (sender_id) references member;
alter table if exists message_read_status
    add constraint FKrmeu8t3avlxdhmqwlsl6kmma foreign key (message_id) references message