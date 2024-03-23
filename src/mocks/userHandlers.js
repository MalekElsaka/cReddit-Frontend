import { http, HttpResponse } from "msw"


export const userHandlers = [

    http.post('/user/login', async (resolver) => {
        try {
            const body = await resolver.request.json();
            if (body.username !== "Malek" || body.password !== "123456789") {
                throw new Error('Invalid username or password');
            }
            return HttpResponse.json({
                message: "User logged in successfully"
            });
        } catch (error) {
            return HttpResponse.json({
                message: error.message
            }, { status: 400 });
        }
    }),

    http.post('/user', async (resolver) => {
        try {
            const body = await resolver.request.json();
            if (body.email === "malek13122002@gmail.com") {
                throw new Error('Email already logged');
            }
            return HttpResponse.json({
                message: "User created successfully"
            });
        } catch (error) {
            return HttpResponse.json({
                message: error.message
            }, { status: 400 });
        }
    }),

    http.get('/user/is-available/:username', async (resolver) => {

        try {
            if (resolver.params.username == "Malek") {
                throw new Error('Username already taken');
            }
            return HttpResponse.json([
                {
                    message: "Username is available",
                    available: true
                }
            ])
        }
        catch (error) {
            return HttpResponse.json({
                message: error.message
            }, { status: 400 });
        }
    }),


    http.post('/user/forgot-password', async (resolver) => {
        try {
            const body = await resolver.request.json();
            if (body.email !== "malek13122002@gmail.com") {
                throw new Error('Email Does not Exist');
            }
            return HttpResponse.json({
                message: "Verify email sent succesfully"
            });
        } catch (error) {
            return HttpResponse.json({
                message: error.message
            }, { status: 400 });
        }
    }),


    http.post('/user/forgot-username', async (resolver) => {
        try {
            const body = await resolver.request.json();
            if (body.email !== "malek13122002@gmail.com") {
                throw new Error('Email Does not Exist');
            }
            return HttpResponse.json({
                message: "User logged in successfully"
            });
        } catch (error) {
            return HttpResponse.json({
                message: error.message
            }, { status: 400 });
        }
    }),

    http.delete('/user', async (resolver) => {
        return HttpResponse.json(
            {
                message: "User deleted successfully"
            }
        )
    }),



    http.post('/user/auth/google', async (resolver) => {
        const token = await resolver.request.json();

        return HttpResponse.json(
            {
                message: "User logged in successfully"
            }
        )
    }),
    http.get('/user/logout', async (resolver) => {
        return HttpResponse.json(
            {
                message: "User logged out successfully"
            }
        )
    }),
    http.get('/user/refreshToken', async (resolver) => {
        return HttpResponse.json(
            {
                message: "Token refreshed successfully"
            }
        )
    }),
    http.get('/user/verify/:verificationToken', async (resolver) => {

        // console.log("resolverVerficition", resolver.params.verificationToken)
        return HttpResponse.json(
            {
                message: "User verified successfully"
            }
        )
    }),
    http.get('/user/u/:username', async (resolver) => {

        return HttpResponse.json(
            {
                username: "theUser",
                displayName: "theUser",
                about: "Hello to my page",
                email: "john@email.com",
                profilePicture: "drive.creddit.com/pfp",
                banner: "drive.creddit.com/pfp",
                followers: 100,
                cakeDay: "29/08/2023"
            }
        )
    }),
    http.get('/user/:username/overview', async (resolver) => {
        return HttpResponse.json(
            {
                posts: [
                    "",
                    ""
                ]
            }
        )
    }),
    http.get('/user/:username/upvoted', async (resolver) => {
        return HttpResponse.json(
            {
                comments: 50,
                upvotes: 1500,
                pollVotes: {
                    option3: 40,
                    option1: 10,
                    option2: 20
                },
                isDownvoted: false,
                isNSFW: false,
                isUpvoted: true,
                postId: "350651awd651awd",
                ownerId: "350651awd651awd",
                title: "Hello World",
                downvotes: 100,
                content: "This is my content",
                isFollowed: true,
                isSpoiler: false,
                ownerProfilePicture: "drive.creddit.com/test",
                uploadDate: "06/03/2024 22:10:03",
                children: [
                    "",
                    ""
                ],
                isSaved: true,
                isLocked: true,
                communityProfilePicture: "drive.creddit.com / test",
                communityId: "350651awd651awd"
            }
        )
    }),
    http.get('/user/:username/downvoted', async (resolver) => {
        return HttpResponse.json(
            {
                comments: 50,
                upvotes: 1500,
                pollVotes: {
                    option3: 40,
                    option1: 10,
                    option2: 20
                },
                isDownvoted: false,
                isNSFW: false,
                isUpvoted: true,
                postId: "350651awd651awd",
                ownerId: "350651awd651awd",
                title: "Hello World",
                downvotes: 100,
                content: "This is my content",
                isFollowed: true,
                isSpoiler: false,
                ownerProfilePicture: "drive.creddit.com/test",
                uploadDate: "06/03/2024 22:10:03",
                children: [
                    "",
                    ""
                ],
                isSaved: true,
                isLocked: true,
                communityProfilePicture: "drive.creddit.com / test",
                communityId: "350651awd651awd"
            }
        )
    }),
    http.get('/user/submitted/:username', async (resolver) => {
        return HttpResponse.json(
            {
                comments: 50,
                upvotes: 1500,
                pollVotes: {
                    option3: 40,
                    option1: 10,
                    option2: 20
                },
                isDownvoted: false,
                isNSFW: false,
                isUpvoted: true,
                postId: "350651awd651awd",
                ownerId: "350651awd651awd",
                title: "Hello World",
                downvotes: 100,
                content: "This is my content",
                isFollowed: true,
                isSpoiler: false,
                ownerProfilePicture: "drive.creddit.com/test",
                uploadDate: "06/03/2024 22:10:03",
                children: [
                    "",
                    ""
                ],
                isSaved: true,
                isLocked: true,
                communityProfilePicture: "drive.creddit.com / test",
                communityId: "350651awd651awd"
            }
        )
    }),
    http.get('/user/settings', async (resolver) => {
        return HttpResponse.json(
            {
                country: "Egypt",
                gender: "Man",
                displayName: "theUser",
                about: "Hello world",
                email: "jondoe@gmail.com",
                preferences: {
                    socialLinks: [
                        {
                            displayName: "El Buy Me a Coffee bta3y",
                            platform: "Buy Me a Coffee",
                            url: "https://twitter.com/faUwUsa"
                        },
                        {
                            displayName: "El twitter bta3y",
                            platform: "Twitter",
                            url: "https://twitter.com/faUwUsa"
                        },
                        {
                            displayName: "El Reddit bta3y",
                            platform: "Reddit",
                            url: "https://twitter.com/faUwUsa"
                        },
                        {
                            displayName: "El Discord bta3y",
                            platform: "Discord",
                            url: "https://twitter.com/faUwUsa"
                        },
                        {
                            displayName: "El Facebook bta3y",
                            platform: "Facebook",
                            url: "https://twitter.com/faUwUsa"
                        },
                    ],
                    inboxMessagesNotif: true,
                    repliesNotif: true,
                    communityContentSort: "top",
                    apple: "apple id",
                    openNewTab: true,
                    twitter: "twitter handle",
                    followEmail: true,
                    modNotif: true,
                    upvotesNotif: true,
                    cakeDayNotif: true,
                    isActiveCommunityVisible: false,
                    communityThemes: true,
                    chatMessagesNotif: true,
                    globalContentView: "card",
                    chatRequests: true,
                    showAdultContent: true,
                    isContentVisible: true,
                    google: "jondoe@gmail.com",
                    mentionsNotif: false,
                    newFollowerNotif: false,
                    invitationNotif: true,
                    commentsNotif: true,
                    autoPlayMedia: false,
                    allowFollow: true,
                    darkMode: true,
                    chatEmail: true
                },
                connectedToTwitter: false,
                connectedToApple: true,
                connectedToGoogle: false
            }
        )
    }),

    http.put('/user/settings', async (resolver) => {
        return HttpResponse.json(
            {
                country: "Egypt",
                preferences: {
                    socialLinks: [
                        {
                            displayName: "El twitter bta3y",
                            platform: "twitter",
                            url: "https://twitter.com/faUwUsa"
                        },
                        {
                            displayName: "El twitter bta3y",
                            platform: "twitter",
                            url: "https://twitter.com/faUwUsa"
                        }
                    ],
                    inboxMessagesNotif: true,
                    repliesNotif: true,
                    communityContentSort: "top",
                    apple: "apple id",
                    openNewTab: true,
                    twitter: "twitter handle",
                    followEmail: true,
                    modNotif: true,
                    upvotesNotif: true,
                    cakeDayNotif: true,
                    isActiveCommunityVisible: true,
                    communityThemes: true,
                    chatMessagesNotif: true,
                    globalContentView: "card",
                    chatRequests: true,
                    showAdultContent: true,
                    isContentVisible: true,
                    google: "jondoe@gmail.com",
                    mentionsNotif: true,
                    newFollowerNotif: true,
                    invitationNotif: true,
                    commentsNotif: true,
                    autoPlayMedia: true,
                    allowFollow: true,
                    darkMode: true,
                    chatEmail: true
                },
                gender: "Man",
                displayName: "theUser",
                about: "Hello world",
                email: "jondoe@gmail.com"
            }
        )
    }),





    http.patch('/user/change-password', async (resolver) => {

        return HttpResponse.json(
            {
                newPassword: "Xyz789"
            }
        )
    }),



    http.patch('/user/reset-password', async (resolver) => {

        return HttpResponse.json([
            {
                oldPassword: "Abc123",
                newPassword: "Xyz789"
            }
        ])
    }),



    http.patch('/user/change-email', async (resolver) => {

        return HttpResponse.json([
            {
                password: "Abc123",
                newEmail: "john@email.com"
            }
        ])
    }),


    http.post('/user/follow/:username', async (resolver) => {

        return HttpResponse.json([
            {
                status: "OK",
                message: "Username blocked"
            }
        ])
    }),



    http.delete('/user/block/:username', async (resolver) => {

        return HttpResponse.json([
            {
                status: "OK",
                message: "Username unblocked"
            }
        ])
    }),


    http.post('/user/follow/:username', async (resolver) => {

        return HttpResponse.json([
            {
                status: "OK",
                message: "Username followed"
            }
        ])
    }),

    http.delete('/user/follow/:username', async (resolver) => {

        return HttpResponse.json([
            {
                status: "OK",
                message: "Username unfollowed"
            }
        ])
    }),






    http.delete('/user/clear-history', async (resolver) => {

        return HttpResponse.json(
            {
                message: "User history cleared successfully"
            }
        )
    }),

    http.post('/user/block-community/:subreddit', async (resolver) => {

        return HttpResponse.json(
            {
                message: "Community blocked successfully"
            }
        )
    }),

    http.delete('/user/block-community/:subreddit', async (resolver) => {

        return HttpResponse.json(
            {
                message: "Community unblocked successfully"
            }
        )
    }),

    http.get('/user/history', async (resolver) => {
        return HttpResponse.json([
            {
                comments: 50,
                upvotes: 1500,
                pollVotes: {
                    option3: 40,
                    option1: 10,
                    option2: 20
                },
                isDownvoted: false,
                isNSFW: false,
                isUpvoted: true,
                postId: "350651awd651awd",
                ownerId: "350651awd651awd",
                title: "Hello World",
                downvotes: 100,
                content: "This is my content",
                isFollowed: true,
                isSpoiler: false,
                ownerProfilePicture: "drive.creddit.com/test",
                uploadDate: "06/03/2024 22:10:03",
                children: [
                    "",
                    ""
                ],
                isSaved: true,
                isLocked: true,
                communityProfilePicture: "drive.creddit.com / test",
                communityId: "350651awd651awd"
            }
        ])
    }),


    http.get('/user/saved-posts', async (resolver) => {
        return HttpResponse.json([
            {
                comments: 50,
                upvotes: 1500,
                pollVotes: {
                    option3: 40,
                    option1: 10,
                    option2: 20
                },
                isDownvoted: false,
                isNSFW: false,
                isUpvoted: true,
                postId: "350651awd651awd",
                ownerId: "350651awd651awd",
                title: "Hello World",
                downvotes: 100,
                content: "This is my content",
                isFollowed: true,
                isSpoiler: false,
                ownerProfilePicture: "drive.creddit.com/test",
                uploadDate: "06/03/2024 22:10:03",
                children: [
                    "",
                    ""
                ],
                isSaved: true,
                isLocked: true,
                communityProfilePicture: "drive.creddit.com / test",
                communityId: "350651awd651awd"
            }
        ])
    }),



]