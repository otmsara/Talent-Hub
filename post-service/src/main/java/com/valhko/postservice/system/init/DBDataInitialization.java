package com.valhko.postservice.system.init;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Profile("test")
public class DBDataInitialization implements CommandLineRunner {

    @Override
    public void run(String... args) {
        /*Post post1 = Post.builder()
                .type(PostType.POST)
                .status(PostStatus.PUBLIC)
                .isNetworkingOnly(false)
                .content("Starting a new project using React and Node.js for a social recipe sharing app. Looking for collaborators!")
                .link("https://github.com/dev_jane/recipe-app")
                .build();

        Post post2 = Post.builder()
                .type(PostType.POST)
                .status(PostStatus.PUBLIC)
                .isNetworkingOnly(false)
                .content("How can I optimize batch inserts with Spring Data JPA and PostgreSQL? `saveAll` seems slow for 10k+ records.")
                .link(null)
                .build();

        Post post3 = Post.builder()
                .type(PostType.PROJECT)
                .status(PostStatus.PUBLIC)
                .neededContributors(Arrays.asList(NeededContributor.builder().job("Front-End").build()))
                .isNetworkingOnly(false)
                .content("Microservices vs. Monolith: What are the key decision factors for a startup aiming for rapid scaling in 2024?")
                .link(null)
                .build();

        Post post4 = Post.builder()
                .type(PostType.POST) // Assuming you have this type
                .status(PostStatus.PUBLIC)
                .isNetworkingOnly(false)
                .content("Interesting article on the future of WebAssembly beyond the browser. Seems promising for server-side applications too.")
                .link("https://example.com/webassembly-future-article") // Example link
                .build();

        Post post5 = Post.builder()
                .type(PostType.POST) // Or a dedicated NETWORKING type
                .status(PostStatus.DRAFT)
                .isNetworkingOnly(true) // Networking focused post
                .content("Anyone attending the JavaZone conference in Oslo this year? Would love to connect and chat about modern Java frameworks!")
                .link("https://javazone.no/")
                .build();

        Post post6 = Post.builder()
                .type(PostType.POST)
                .status(PostStatus.PUBLIC)
                .isNetworkingOnly(false)
                .content("Building a machine learning model for sentiment analysis deployed via Django REST Framework. Need help fine-tuning the model and API endpoints.")
                .link(null)
                .build();

        Post post7 = Post.builder()
                .type(PostType.POST)
                .status(PostStatus.PUBLIC)
                .isNetworkingOnly(false)
                .content("What's the current best practice for state management in a large React application? Context API vs. Zustand vs. Redux Toolkit? Pros and Cons?")
                .link(null)
                .build();

        Post post8 = Post.builder()
                .type(PostType.POST)
                .status(PostStatus.PRIVATE)
                .isNetworkingOnly(false)
                .content("Great overview of Kubernetes cost optimization strategies. Essential reading for anyone running K8s in production.")
                .link("https://cloud.google.com/blog/products/containers-kubernetes/best-practices-for-optimizing-your-kubernetes-costs")
                .build();

        Post post9 = Post.builder()
                .type(PostType.POST) // Assuming you have this type
                .status(PostStatus.PUBLIC)
                .isNetworkingOnly(false)
                .content("Announcing our local tech meetup next month! Theme: AI in Software Development. Call for speakers is open!")
                .link("https://meetup.com/your-local-tech-group")
                .build();

        Post post10 = Post.builder()
                .type(PostType.POST)
                .status(PostStatus.PUBLIC) // Example of a closed post
                .isNetworkingOnly(false)
                .content("Seeking feedback on a new UI design for a project management tool. (Feedback phase now closed, thanks everyone!)")
                .link("https://figma.com/link-to-design-preview") // Could be a real link
                .build();

        User u1 = User.builder()
                .id("e714fb2a-dc82-4140-994b-00242a2f499b")
                .firstName("John")
                .lastName("Wick")
                .username("JohnWick")
                .posts(Arrays.asList(post1, post8))
                .avatarUrl("https://arya.net/media-container/ec2c9988-a473-4e1a-acea-c04d0f852b2c.png")
                .build();

        User u2 = User.builder()
                .id("d8f90fc9-0b5a-4e0a-8356-930090b200ff")
                .firstName("Alice")
                .lastName("Johnson")
                .username("AliceJ")
                .posts(Arrays.asList(post2, post9))
                .avatarUrl("https://arya.net/media-container/ec2c9988-a473-4e1a-acea-c04d0f852b2d.png")
                .build();

        User u3 = User.builder()
                .id("d1dc3950-1c97-4e6e-a663-177c5375db37")
                .firstName("Mark")
                .lastName("Twain")
                .username("MarkT")
                .posts(Arrays.asList(post3, post10))
                .avatarUrl("https://arya.net/media-container/ec2c9988-a473-4e1a-acea-c04d0f852b2e.png")
                .build();

        User u4 = User.builder()
                .id("ab37a738-4de8-49e7-bcf6-dc0e5d98a664")
                .firstName("Sophie")
                .lastName("Lévesque")
                .username("SophieL")
                .posts(Arrays.asList(post4, post7))
                .avatarUrl("https://arya.net/media-container/ec2c9988-a473-4e1a-acea-c04d0f852b2f.png")
                .build();

        User u5 = User.builder()
                .id("c59dc65b-a6e5-4fce-9990-22d11771d09b")
                .firstName("Leo")
                .lastName("Nguyen")
                .username("LeoN")
                .posts(Arrays.asList(post5))
                .avatarUrl("https://arya.net/media-container/ec2c9988-a473-4e1a-acea-c04d0f852b2g.png")
                .build();

        User u6 = User.builder()
                .id("1d25aa5e-1518-439b-a3b1-88ed79a327d4")
                .firstName("Maya")
                .lastName("Khan")
                .username("MayaK")
                .posts(Arrays.asList(post6))
                .avatarUrl("https://arya.net/media-container/ec2c9988-a473-4e1a-acea-c04d0f852b2k.png")
                .build();

        userRepo.saveAll(Arrays.asList(u1, u2, u3, u4, u5, u6));*/
    }
}
