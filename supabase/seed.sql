-- Seeds the shared fictional creator dataset without replacing private account records.


begin;

insert into public.audience_posts (creator_id,id,title,caption,published_at,thumbnail,format)
select '00000000-0000-4000-8000-000000000001'::uuid,id,title,caption,"publishedAt"::timestamptz,thumbnail,format
from jsonb_to_recordset($seed$[{"id": "post-01", "title": "A little look behind the scenes", "caption": "The in-between moments are always my favourite. A little glimpse into today’s shoot.", "publishedAt": "2026-10-01T10:00:00Z", "thumbnail": "/images/studio.jpg", "format": "Video"}, {"id": "post-02", "title": "Slow mornings, good coffee", "caption": "No big plans. Just coffee, a little sunshine, and catching up with you.", "publishedAt": "2026-10-02T21:00:00Z", "thumbnail": "/images/coffee.jpg", "format": "Photo"}, {"id": "post-03", "title": "Golden hour, unfiltered", "caption": "Chasing the last light. Which photo is your favourite?", "publishedAt": "2026-10-04T08:00:00Z", "thumbnail": "/images/sunset.jpg", "format": "Photo"}, {"id": "post-04", "title": "Let’s catch up, live", "caption": "A little life update and a lot of your questions. Thanks for hanging out.", "publishedAt": "2026-10-05T19:00:00Z", "thumbnail": "/images/portrait.jpg", "format": "Live"}, {"id": "post-05", "title": "Come on a city walk with me", "caption": "My favourite corners of the city, through my lens.", "publishedAt": "2026-10-07T06:00:00Z", "thumbnail": "/images/city.jpg", "format": "Video"}, {"id": "post-06", "title": "Sunday reset", "caption": "Fresh flowers, my favourite playlist, and a quiet afternoon.", "publishedAt": "2026-10-08T17:00:00Z", "thumbnail": "/images/flowers.jpg", "format": "Photo"}, {"id": "post-07", "title": "The making of a shoot", "caption": "From the first idea to the final shot. Here’s what it actually looks like.", "publishedAt": "2026-10-10T04:00:00Z", "thumbnail": "/images/studio.jpg", "format": "Video"}, {"id": "post-08", "title": "Coffee and a conversation", "caption": "Tell me one good thing that happened to you this week.", "publishedAt": "2026-10-11T15:00:00Z", "thumbnail": "/images/coffee.jpg", "format": "Photo"}, {"id": "post-09", "title": "Sunset on film", "caption": "A little collection of moments from the coast.", "publishedAt": "2026-10-13T02:00:00Z", "thumbnail": "/images/sunset.jpg", "format": "Photo"}, {"id": "post-10", "title": "Your questions, answered", "caption": "You asked. I answered. Let’s do this more often.", "publishedAt": "2026-10-14T13:00:00Z", "thumbnail": "/images/portrait.jpg", "format": "Video"}, {"id": "post-11", "title": "A day away", "caption": "A mini escape and a few new places to fall in love with.", "publishedAt": "2026-10-16T00:00:00Z", "thumbnail": "/images/city.jpg", "format": "Video"}, {"id": "post-12", "title": "Something just for you", "caption": "A few favourites that haven’t made it anywhere else.", "publishedAt": "2026-10-17T11:00:00Z", "thumbnail": "/images/flowers.jpg", "format": "Photo"}, {"id": "post-13", "title": "Before the camera rolls", "caption": "Real life, messy desk, and all.", "publishedAt": "2026-10-18T22:00:00Z", "thumbnail": "/images/studio.jpg", "format": "Video"}, {"id": "post-14", "title": "A slow Saturday", "caption": "Taking a little time to recharge. What are you up to?", "publishedAt": "2026-10-20T09:00:00Z", "thumbnail": "/images/coffee.jpg", "format": "Photo"}, {"id": "post-15", "title": "One last summer evening", "caption": "Holding on to these colours a little longer.", "publishedAt": "2026-10-21T20:00:00Z", "thumbnail": "/images/sunset.jpg", "format": "Photo"}, {"id": "post-16", "title": "Our monthly catch-up", "caption": "Good questions and the best company. See you in the next one.", "publishedAt": "2026-10-23T07:00:00Z", "thumbnail": "/images/portrait.jpg", "format": "Live"}, {"id": "post-17", "title": "Out of office", "caption": "A little weekend adventure. Come along for the ride.", "publishedAt": "2026-10-24T18:00:00Z", "thumbnail": "/images/city.jpg", "format": "Video"}, {"id": "post-18", "title": "Little moments lately", "caption": "A photo diary of the small things that made this week special.", "publishedAt": "2026-10-26T05:00:00Z", "thumbnail": "/images/flowers.jpg", "format": "Photo"}]$seed$::jsonb) as records(id text,title text,caption text,"publishedAt" text,thumbnail text,format text)
on conflict (creator_id,id) do update set title=excluded.title, caption=excluded.caption, published_at=excluded.published_at, thumbnail=excluded.thumbnail, format=excluded.format;

insert into public.audience_fans (creator_id,id,username,display_name)
select '00000000-0000-4000-8000-000000000001'::uuid,id,username,"displayName"
from jsonb_to_recordset($seed$[{"id": "fan-001", "username": "alex20", "displayName": "Alex"}, {"id": "fan-002", "username": "jamie21", "displayName": "Jamie"}, {"id": "fan-003", "username": "sam22", "displayName": "Sam"}, {"id": "fan-004", "username": "jordan23", "displayName": "Jordan"}, {"id": "fan-005", "username": "taylor24", "displayName": "Taylor"}, {"id": "fan-006", "username": "chris25", "displayName": "Chris"}, {"id": "fan-007", "username": "morgan26", "displayName": "Morgan"}, {"id": "fan-008", "username": "jess27", "displayName": "Jess"}, {"id": "fan-009", "username": "charlie28", "displayName": "Charlie"}, {"id": "fan-010", "username": "riley29", "displayName": "Riley"}, {"id": "fan-011", "username": "drew30", "displayName": "Drew"}, {"id": "fan-012", "username": "casey31", "displayName": "Casey"}, {"id": "fan-013", "username": "robin32", "displayName": "Robin"}, {"id": "fan-014", "username": "cameron33", "displayName": "Cameron"}, {"id": "fan-015", "username": "blake34", "displayName": "Blake"}, {"id": "fan-016", "username": "skyler35", "displayName": "Skyler"}, {"id": "fan-017", "username": "finley36", "displayName": "Finley"}, {"id": "fan-018", "username": "avery37", "displayName": "Avery"}, {"id": "fan-019", "username": "quinn38", "displayName": "Quinn"}, {"id": "fan-020", "username": "noah39", "displayName": "Noah"}, {"id": "fan-021", "username": "leo40", "displayName": "Leo"}, {"id": "fan-022", "username": "max41", "displayName": "Max"}, {"id": "fan-023", "username": "theo42", "displayName": "Theo"}, {"id": "fan-024", "username": "mia43", "displayName": "Mia"}, {"id": "fan-025", "username": "alex44", "displayName": "Alex"}, {"id": "fan-026", "username": "jamie45", "displayName": "Jamie"}, {"id": "fan-027", "username": "sam46", "displayName": "Sam"}, {"id": "fan-028", "username": "jordan47", "displayName": "Jordan"}, {"id": "fan-029", "username": "taylor48", "displayName": "Taylor"}, {"id": "fan-030", "username": "chris49", "displayName": "Chris"}, {"id": "fan-031", "username": "morgan50", "displayName": "Morgan"}, {"id": "fan-032", "username": "jess51", "displayName": "Jess"}, {"id": "fan-033", "username": "charlie52", "displayName": "Charlie"}, {"id": "fan-034", "username": "riley53", "displayName": "Riley"}, {"id": "fan-035", "username": "drew54", "displayName": "Drew"}, {"id": "fan-036", "username": "casey55", "displayName": "Casey"}, {"id": "fan-037", "username": "robin56", "displayName": "Robin"}, {"id": "fan-038", "username": "cameron57", "displayName": "Cameron"}, {"id": "fan-039", "username": "blake58", "displayName": "Blake"}, {"id": "fan-040", "username": "skyler59", "displayName": "Skyler"}, {"id": "fan-041", "username": "finley60", "displayName": "Finley"}, {"id": "fan-042", "username": "avery61", "displayName": "Avery"}, {"id": "fan-043", "username": "quinn62", "displayName": "Quinn"}, {"id": "fan-044", "username": "noah63", "displayName": "Noah"}, {"id": "fan-045", "username": "leo64", "displayName": "Leo"}, {"id": "fan-046", "username": "max65", "displayName": "Max"}, {"id": "fan-047", "username": "theo66", "displayName": "Theo"}, {"id": "fan-048", "username": "mia67", "displayName": "Mia"}, {"id": "fan-049", "username": "alex68", "displayName": "Alex"}, {"id": "fan-050", "username": "jamie69", "displayName": "Jamie"}, {"id": "fan-051", "username": "sam70", "displayName": "Sam"}, {"id": "fan-052", "username": "jordan71", "displayName": "Jordan"}, {"id": "fan-053", "username": "taylor72", "displayName": "Taylor"}, {"id": "fan-054", "username": "chris73", "displayName": "Chris"}, {"id": "fan-055", "username": "morgan74", "displayName": "Morgan"}, {"id": "fan-056", "username": "jess75", "displayName": "Jess"}, {"id": "fan-057", "username": "charlie76", "displayName": "Charlie"}, {"id": "fan-058", "username": "riley77", "displayName": "Riley"}, {"id": "fan-059", "username": "drew78", "displayName": "Drew"}, {"id": "fan-060", "username": "casey79", "displayName": "Casey"}, {"id": "fan-061", "username": "robin80", "displayName": "Robin"}, {"id": "fan-062", "username": "cameron81", "displayName": "Cameron"}, {"id": "fan-063", "username": "blake82", "displayName": "Blake"}, {"id": "fan-064", "username": "skyler83", "displayName": "Skyler"}, {"id": "fan-065", "username": "finley84", "displayName": "Finley"}, {"id": "fan-066", "username": "avery85", "displayName": "Avery"}, {"id": "fan-067", "username": "quinn86", "displayName": "Quinn"}, {"id": "fan-068", "username": "noah87", "displayName": "Noah"}, {"id": "fan-069", "username": "leo88", "displayName": "Leo"}, {"id": "fan-070", "username": "max89", "displayName": "Max"}, {"id": "fan-071", "username": "theo90", "displayName": "Theo"}, {"id": "fan-072", "username": "mia91", "displayName": "Mia"}, {"id": "fan-073", "username": "alex92", "displayName": "Alex"}, {"id": "fan-074", "username": "jamie93", "displayName": "Jamie"}, {"id": "fan-075", "username": "sam94", "displayName": "Sam"}, {"id": "fan-076", "username": "jordan95", "displayName": "Jordan"}, {"id": "fan-077", "username": "taylor96", "displayName": "Taylor"}, {"id": "fan-078", "username": "chris97", "displayName": "Chris"}, {"id": "fan-079", "username": "morgan98", "displayName": "Morgan"}, {"id": "fan-080", "username": "jess99", "displayName": "Jess"}, {"id": "fan-081", "username": "charlie100", "displayName": "Charlie"}, {"id": "fan-082", "username": "riley101", "displayName": "Riley"}, {"id": "fan-083", "username": "drew102", "displayName": "Drew"}, {"id": "fan-084", "username": "casey103", "displayName": "Casey"}, {"id": "fan-085", "username": "robin104", "displayName": "Robin"}, {"id": "fan-086", "username": "cameron105", "displayName": "Cameron"}, {"id": "fan-087", "username": "blake106", "displayName": "Blake"}, {"id": "fan-088", "username": "skyler107", "displayName": "Skyler"}, {"id": "fan-089", "username": "finley108", "displayName": "Finley"}, {"id": "fan-090", "username": "avery109", "displayName": "Avery"}, {"id": "fan-091", "username": "quinn110", "displayName": "Quinn"}, {"id": "fan-092", "username": "noah111", "displayName": "Noah"}, {"id": "fan-093", "username": "leo112", "displayName": "Leo"}, {"id": "fan-094", "username": "max113", "displayName": "Max"}, {"id": "fan-095", "username": "theo114", "displayName": "Theo"}, {"id": "fan-096", "username": "mia115", "displayName": "Mia"}]$seed$::jsonb) as records(id text,username text,"displayName" text)
on conflict (creator_id,id) do update set username=excluded.username, display_name=excluded.display_name;

insert into public.audience_comments (creator_id,id,post_id,fan_id,text,created_at)
select '00000000-0000-4000-8000-000000000001'::uuid,id,"postId","fanId",text,"createdAt"::timestamptz
from jsonb_to_recordset($seed$[{"id": "comment-0001", "postId": "post-01", "fanId": "fan-001", "text": "The behind the scenes bits are honestly my favourite. Love seeing how you put everything together.", "createdAt": "2026-10-01T10:15:00Z"}, {"id": "comment-0002", "postId": "post-01", "fanId": "fan-008", "text": "The little details in the background are gorgeous too.", "createdAt": "2026-10-01T10:56:00Z"}, {"id": "comment-0003", "postId": "post-01", "fanId": "fan-015", "text": "The everyday posts are just as good as the big shoots to me.", "createdAt": "2026-10-01T11:37:00Z"}, {"id": "comment-0004", "postId": "post-01", "fanId": "fan-022", "text": "This was lovely but I was expecting a few more minutes.", "createdAt": "2026-10-01T12:18:00Z"}, {"id": "comment-0005", "postId": "post-01", "fanId": "fan-029", "text": "Could barely hear the last part with the wind. Maybe a mic would help?", "createdAt": "2026-10-01T12:59:00Z"}, {"id": "comment-0006", "postId": "post-01", "fanId": "fan-036", "text": "Is there a place we can submit questions for your next live?", "createdAt": "2026-10-01T13:40:00Z"}, {"id": "comment-0007", "postId": "post-01", "fanId": "fan-043", "text": "Can we vote on the theme for the next shoot?", "createdAt": "2026-10-01T14:21:00Z"}, {"id": "comment-0008", "postId": "post-01", "fanId": "fan-050", "text": "What song is this?", "createdAt": "2026-10-01T15:02:00Z"}, {"id": "comment-0009", "postId": "post-01", "fanId": "fan-057", "text": "This is why I follow you. The unfiltered little moments feel so much more personal.", "createdAt": "2026-10-01T15:43:00Z"}, {"id": "comment-0010", "postId": "post-01", "fanId": "fan-064", "text": "Your photos have such a distinctive feel. I can always tell it’s you.", "createdAt": "2026-10-01T16:24:00Z"}, {"id": "comment-0011", "postId": "post-01", "fanId": "fan-071", "text": "I appreciate you checking in with us. Such a nice community.", "createdAt": "2026-10-01T17:05:00Z"}, {"id": "comment-0012", "postId": "post-01", "fanId": "fan-078", "text": "Please give us an extended cut. It ends too quickly!", "createdAt": "2026-10-01T17:46:00Z"}, {"id": "comment-0013", "postId": "post-01", "fanId": "fan-085", "text": "Love this but the background music is louder than your voice.", "createdAt": "2026-10-01T18:27:00Z"}, {"id": "comment-0014", "postId": "post-01", "fanId": "fan-092", "text": "A monthly Q&A would be amazing. I’d definitely show up.", "createdAt": "2026-10-01T19:08:00Z"}, {"id": "comment-0015", "postId": "post-01", "fanId": "fan-003", "text": "Would love to help pick the location next time.", "createdAt": "2026-10-01T19:49:00Z"}, {"id": "comment-0016", "postId": "post-01", "fanId": "fan-010", "text": "Just caught up on all your posts.", "createdAt": "2026-10-01T20:30:00Z"}, {"id": "comment-0017", "postId": "post-01", "fanId": "fan-017", "text": "Seeing the process makes the finished photos even better. More of this please!", "createdAt": "2026-10-01T21:11:00Z"}, {"id": "comment-0018", "postId": "post-01", "fanId": "fan-024", "text": "Honestly one of my favourite photo sets you’ve shared.", "createdAt": "2026-10-01T21:52:00Z"}, {"id": "comment-0019", "postId": "post-01", "fanId": "fan-031", "text": "These casual conversations make it feel really personal.", "createdAt": "2026-10-01T22:33:00Z"}, {"id": "comment-0020", "postId": "post-01", "fanId": "fan-038", "text": "I feel like the videos used to be longer. Miss that.", "createdAt": "2026-10-01T23:14:00Z"}, {"id": "comment-0021", "postId": "post-02", "fanId": "fan-014", "text": "Maybe ask us which idea we want to see first?", "createdAt": "2026-10-02T21:15:00Z"}, {"id": "comment-0022", "postId": "post-02", "fanId": "fan-021", "text": "Please do a longer city walk video sometime.", "createdAt": "2026-10-02T21:56:00Z"}, {"id": "comment-0023", "postId": "post-02", "fanId": "fan-028", "text": "That looks like my old neighbourhood.", "createdAt": "2026-10-02T22:37:00Z"}, {"id": "comment-0024", "postId": "post-02", "fanId": "fan-035", "text": "The coffee catch ups are my favourite part of the week.", "createdAt": "2026-10-02T23:18:00Z"}, {"id": "comment-0025", "postId": "post-02", "fanId": "fan-042", "text": "Every photo feels so thoughtfully put together.", "createdAt": "2026-10-02T23:59:00Z"}, {"id": "comment-0026", "postId": "post-02", "fanId": "fan-049", "text": "Please open a question box before the next session!", "createdAt": "2026-10-03T00:40:00Z"}, {"id": "comment-0027", "postId": "post-02", "fanId": "fan-056", "text": "It would be so fun to help choose your next adventure.", "createdAt": "2026-10-03T01:21:00Z"}, {"id": "comment-0028", "postId": "post-02", "fanId": "fan-063", "text": "Would love to see a day outside the studio, just your normal routine.", "createdAt": "2026-10-03T02:02:00Z"}, {"id": "comment-0029", "postId": "post-02", "fanId": "fan-070", "text": "Happy Sunday!", "createdAt": "2026-10-03T02:43:00Z"}, {"id": "comment-0030", "postId": "post-02", "fanId": "fan-077", "text": "I really like the quieter posts where you just talk about your day.", "createdAt": "2026-10-03T03:24:00Z"}, {"id": "comment-0031", "postId": "post-02", "fanId": "fan-084", "text": "That golden light is everything. Such a beautiful set.", "createdAt": "2026-10-03T04:05:00Z"}, {"id": "comment-0032", "postId": "post-02", "fanId": "fan-091", "text": "I’d love another ask me anything. The last one was brilliant.", "createdAt": "2026-10-03T04:46:00Z"}, {"id": "comment-0033", "postId": "post-02", "fanId": "fan-002", "text": "Can you put the next two ideas to a vote?", "createdAt": "2026-10-03T05:27:00Z"}, {"id": "comment-0034", "postId": "post-02", "fanId": "fan-009", "text": "A little travel series would be amazing.", "createdAt": "2026-10-03T06:08:00Z"}, {"id": "comment-0035", "postId": "post-02", "fanId": "fan-016", "text": "Lovely!", "createdAt": "2026-10-03T06:49:00Z"}, {"id": "comment-0036", "postId": "post-02", "fanId": "fan-023", "text": "Your updates feel so welcoming. Happy to be here.", "createdAt": "2026-10-03T07:30:00Z"}, {"id": "comment-0037", "postId": "post-02", "fanId": "fan-030", "text": "Your eye for composition is incredible.", "createdAt": "2026-10-03T08:11:00Z"}, {"id": "comment-0038", "postId": "post-02", "fanId": "fan-037", "text": "Can we do another live Q&A soon? I missed the last one!", "createdAt": "2026-10-03T08:52:00Z"}, {"id": "comment-0039", "postId": "post-02", "fanId": "fan-044", "text": "A community choice post would be amazing.", "createdAt": "2026-10-03T09:33:00Z"}, {"id": "comment-0040", "postId": "post-02", "fanId": "fan-051", "text": "Can we see more of the places you visit?", "createdAt": "2026-10-03T10:14:00Z"}, {"id": "comment-0041", "postId": "post-03", "fanId": "fan-027", "text": "These casual conversations make it feel really personal.", "createdAt": "2026-10-04T08:15:00Z"}, {"id": "comment-0042", "postId": "post-03", "fanId": "fan-034", "text": "You should let us choose between two ideas for your next post!", "createdAt": "2026-10-04T08:56:00Z"}, {"id": "comment-0043", "postId": "post-03", "fanId": "fan-041", "text": "Take us with you next time! Would love a relaxed vlog.", "createdAt": "2026-10-04T09:37:00Z"}, {"id": "comment-0044", "postId": "post-03", "fanId": "fan-048", "text": "Thanks for sharing.", "createdAt": "2026-10-04T10:18:00Z"}, {"id": "comment-0045", "postId": "post-03", "fanId": "fan-055", "text": "Honestly one of my favourite photo sets you’ve shared.", "createdAt": "2026-10-04T10:59:00Z"}, {"id": "comment-0046", "postId": "post-03", "fanId": "fan-062", "text": "Such a lovely little update. Hope your week is going well.", "createdAt": "2026-10-04T11:40:00Z"}, {"id": "comment-0047", "postId": "post-03", "fanId": "fan-069", "text": "A poll for what to do next would be really fun.", "createdAt": "2026-10-04T12:21:00Z"}, {"id": "comment-0048", "postId": "post-03", "fanId": "fan-076", "text": "Would love a full day in the life video!", "createdAt": "2026-10-04T13:02:00Z"}, {"id": "comment-0049", "postId": "post-03", "fanId": "fan-083", "text": "Anyone else here from the last live?", "createdAt": "2026-10-04T13:43:00Z"}, {"id": "comment-0050", "postId": "post-03", "fanId": "fan-090", "text": "The light in these photos is absolutely beautiful.", "createdAt": "2026-10-04T14:24:00Z"}, {"id": "comment-0051", "postId": "post-03", "fanId": "fan-001", "text": "I look forward to the everyday moments as much as the finished work.", "createdAt": "2026-10-04T15:05:00Z"}, {"id": "comment-0052", "postId": "post-03", "fanId": "fan-008", "text": "Could we have a say in the next photo theme?", "createdAt": "2026-10-04T15:46:00Z"}, {"id": "comment-0053", "postId": "post-03", "fanId": "fan-015", "text": "Can you take us along on your next trip?", "createdAt": "2026-10-04T16:27:00Z"}, {"id": "comment-0054", "postId": "post-03", "fanId": "fan-022", "text": "Not sure what I think yet.", "createdAt": "2026-10-04T17:08:00Z"}, {"id": "comment-0055", "postId": "post-03", "fanId": "fan-029", "text": "Your colour choices are always so good. This whole set is gorgeous.", "createdAt": "2026-10-04T17:49:00Z"}, {"id": "comment-0056", "postId": "post-03", "fanId": "fan-036", "text": "The little check ins make this page feel like a community.", "createdAt": "2026-10-04T18:30:00Z"}, {"id": "comment-0057", "postId": "post-03", "fanId": "fan-043", "text": "Let your fans vote for the next outfit or backdrop.", "createdAt": "2026-10-04T19:11:00Z"}, {"id": "comment-0058", "postId": "post-03", "fanId": "fan-050", "text": "More travel diaries please. I love seeing new places with you.", "createdAt": "2026-10-04T19:52:00Z"}, {"id": "comment-0059", "postId": "post-03", "fanId": "fan-057", "text": "👋", "createdAt": "2026-10-04T20:33:00Z"}, {"id": "comment-0060", "postId": "post-03", "fanId": "fan-064", "text": "The photography on your page just keeps getting better.", "createdAt": "2026-10-04T21:14:00Z"}, {"id": "comment-0061", "postId": "post-04", "fanId": "fan-040", "text": "Music was lovely but I struggled to hear what you were saying.", "createdAt": "2026-10-05T19:15:00Z"}, {"id": "comment-0062", "postId": "post-04", "fanId": "fan-047", "text": "Can you put the next two ideas to a vote?", "createdAt": "2026-10-05T19:56:00Z"}, {"id": "comment-0063", "postId": "post-04", "fanId": "fan-054", "text": "Lovely!", "createdAt": "2026-10-05T20:37:00Z"}, {"id": "comment-0064", "postId": "post-04", "fanId": "fan-061", "text": "Can we do another live Q&A soon? I missed the last one!", "createdAt": "2026-10-05T21:18:00Z"}, {"id": "comment-0065", "postId": "post-04", "fanId": "fan-068", "text": "Your updates feel so welcoming. Happy to be here.", "createdAt": "2026-10-05T21:59:00Z"}, {"id": "comment-0066", "postId": "post-04", "fanId": "fan-075", "text": "I missed this again! A bit more warning before you go live would help.", "createdAt": "2026-10-05T22:40:00Z"}, {"id": "comment-0067", "postId": "post-04", "fanId": "fan-082", "text": "Could you check the sound on the outdoor videos?", "createdAt": "2026-10-05T23:21:00Z"}, {"id": "comment-0068", "postId": "post-04", "fanId": "fan-089", "text": "A community choice post would be amazing.", "createdAt": "2026-10-06T00:02:00Z"}, {"id": "comment-0069", "postId": "post-04", "fanId": "fan-096", "text": "Hope you have a good week.", "createdAt": "2026-10-06T00:43:00Z"}, {"id": "comment-0070", "postId": "post-04", "fanId": "fan-007", "text": "Would love a regular live where we can just ask you things.", "createdAt": "2026-10-06T01:24:00Z"}, {"id": "comment-0071", "postId": "post-04", "fanId": "fan-014", "text": "This made my morning better. Thank you for sharing the little things.", "createdAt": "2026-10-06T02:05:00Z"}, {"id": "comment-0072", "postId": "post-04", "fanId": "fan-021", "text": "Could you announce lives the day before? I never catch them in time.", "createdAt": "2026-10-06T02:46:00Z"}, {"id": "comment-0073", "postId": "post-04", "fanId": "fan-028", "text": "Enjoyed watching, just wish the talking was a bit clearer.", "createdAt": "2026-10-06T03:27:00Z"}, {"id": "comment-0074", "postId": "post-04", "fanId": "fan-035", "text": "I love when we get to be part of the creative process. More polls please.", "createdAt": "2026-10-06T04:08:00Z"}, {"id": "comment-0075", "postId": "post-04", "fanId": "fan-042", "text": "First!", "createdAt": "2026-10-06T04:49:00Z"}, {"id": "comment-0076", "postId": "post-04", "fanId": "fan-049", "text": "Please do more of the question sessions. They are so fun.", "createdAt": "2026-10-06T05:30:00Z"}, {"id": "comment-0077", "postId": "post-04", "fanId": "fan-056", "text": "Love the relaxed vibe on your page lately.", "createdAt": "2026-10-06T06:11:00Z"}, {"id": "comment-0078", "postId": "post-04", "fanId": "fan-063", "text": "Please include the time zone when you post live times.", "createdAt": "2026-10-06T06:52:00Z"}, {"id": "comment-0079", "postId": "post-04", "fanId": "fan-070", "text": "Could barely hear the last part with the wind. Maybe a mic would help?", "createdAt": "2026-10-06T07:33:00Z"}, {"id": "comment-0080", "postId": "post-04", "fanId": "fan-077", "text": "Can we vote on the theme for the next shoot?", "createdAt": "2026-10-06T08:14:00Z"}, {"id": "comment-0081", "postId": "post-05", "fanId": "fan-053", "text": "Could we have a say in the next photo theme?", "createdAt": "2026-10-07T06:15:00Z"}, {"id": "comment-0082", "postId": "post-05", "fanId": "fan-060", "text": "Not sure what I think yet.", "createdAt": "2026-10-07T06:56:00Z"}, {"id": "comment-0083", "postId": "post-05", "fanId": "fan-067", "text": "Can you take us along on your next trip?", "createdAt": "2026-10-07T07:37:00Z"}, {"id": "comment-0084", "postId": "post-05", "fanId": "fan-074", "text": "Your colour choices are always so good. This whole set is gorgeous.", "createdAt": "2026-10-07T08:18:00Z"}, {"id": "comment-0085", "postId": "post-05", "fanId": "fan-081", "text": "Great idea but the short runtime makes it feel rushed.", "createdAt": "2026-10-07T08:59:00Z"}, {"id": "comment-0086", "postId": "post-05", "fanId": "fan-088", "text": "Can you turn your voice up a little next time?", "createdAt": "2026-10-07T09:40:00Z"}, {"id": "comment-0087", "postId": "post-05", "fanId": "fan-095", "text": "Let us know when you’re doing another live. I have so many questions.", "createdAt": "2026-10-07T10:21:00Z"}, {"id": "comment-0088", "postId": "post-05", "fanId": "fan-006", "text": "Let your fans vote for the next outfit or backdrop.", "createdAt": "2026-10-07T11:02:00Z"}, {"id": "comment-0089", "postId": "post-05", "fanId": "fan-013", "text": "👋", "createdAt": "2026-10-07T11:43:00Z"}, {"id": "comment-0090", "postId": "post-05", "fanId": "fan-020", "text": "More travel diaries please. I love seeing new places with you.", "createdAt": "2026-10-07T12:24:00Z"}, {"id": "comment-0091", "postId": "post-05", "fanId": "fan-027", "text": "The photography on your page just keeps getting better.", "createdAt": "2026-10-07T13:05:00Z"}, {"id": "comment-0092", "postId": "post-05", "fanId": "fan-034", "text": "Would love five or ten minutes of this instead of a quick clip.", "createdAt": "2026-10-07T13:46:00Z"}, {"id": "comment-0093", "postId": "post-05", "fanId": "fan-041", "text": "Some parts are difficult to hear with the background noise.", "createdAt": "2026-10-07T14:27:00Z"}, {"id": "comment-0094", "postId": "post-05", "fanId": "fan-048", "text": "The live sessions are great. Any chance of a weekly catch up?", "createdAt": "2026-10-07T15:08:00Z"}, {"id": "comment-0095", "postId": "post-05", "fanId": "fan-055", "text": "I’d love some more interactive polls on here.", "createdAt": "2026-10-07T15:49:00Z"}, {"id": "comment-0096", "postId": "post-05", "fanId": "fan-062", "text": "See you next time.", "createdAt": "2026-10-07T16:30:00Z"}, {"id": "comment-0097", "postId": "post-05", "fanId": "fan-069", "text": "A weekend vlog would be so good.", "createdAt": "2026-10-07T17:11:00Z"}, {"id": "comment-0098", "postId": "post-05", "fanId": "fan-076", "text": "Love the warm tones and the way you capture the little details.", "createdAt": "2026-10-07T17:52:00Z"}, {"id": "comment-0099", "postId": "post-05", "fanId": "fan-083", "text": "I was really enjoying this and then it ended! Wish the videos were a bit longer.", "createdAt": "2026-10-07T18:33:00Z"}, {"id": "comment-0100", "postId": "post-05", "fanId": "fan-090", "text": "The wind noise makes the last bit hard to follow.", "createdAt": "2026-10-07T19:14:00Z"}, {"id": "comment-0101", "postId": "post-06", "fanId": "fan-066", "text": "Love the relaxed vibe on your page lately.", "createdAt": "2026-10-08T17:15:00Z"}, {"id": "comment-0102", "postId": "post-06", "fanId": "fan-073", "text": "The natural light makes the whole thing feel so lovely.", "createdAt": "2026-10-08T17:56:00Z"}, {"id": "comment-0103", "postId": "post-06", "fanId": "fan-080", "text": "I love when we get to be part of the creative process. More polls please.", "createdAt": "2026-10-08T18:37:00Z"}, {"id": "comment-0104", "postId": "post-06", "fanId": "fan-087", "text": "Please do more of the question sessions. They are so fun.", "createdAt": "2026-10-08T19:18:00Z"}, {"id": "comment-0105", "postId": "post-06", "fanId": "fan-094", "text": "First!", "createdAt": "2026-10-08T19:59:00Z"}, {"id": "comment-0106", "postId": "post-06", "fanId": "fan-005", "text": "The everyday posts are just as good as the big shoots to me.", "createdAt": "2026-10-08T20:40:00Z"}, {"id": "comment-0107", "postId": "post-06", "fanId": "fan-012", "text": "The little details in the background are gorgeous too.", "createdAt": "2026-10-08T21:21:00Z"}, {"id": "comment-0108", "postId": "post-06", "fanId": "fan-019", "text": "Can we vote on the theme for the next shoot?", "createdAt": "2026-10-08T22:02:00Z"}, {"id": "comment-0109", "postId": "post-06", "fanId": "fan-026", "text": "Is there a place we can submit questions for your next live?", "createdAt": "2026-10-08T22:43:00Z"}, {"id": "comment-0110", "postId": "post-06", "fanId": "fan-033", "text": "What song is this?", "createdAt": "2026-10-08T23:24:00Z"}, {"id": "comment-0111", "postId": "post-06", "fanId": "fan-040", "text": "I appreciate you checking in with us. Such a nice community.", "createdAt": "2026-10-09T00:05:00Z"}, {"id": "comment-0112", "postId": "post-06", "fanId": "fan-047", "text": "Your photos have such a distinctive feel. I can always tell it’s you.", "createdAt": "2026-10-09T00:46:00Z"}, {"id": "comment-0113", "postId": "post-06", "fanId": "fan-054", "text": "Would love to help pick the location next time.", "createdAt": "2026-10-09T01:27:00Z"}, {"id": "comment-0114", "postId": "post-06", "fanId": "fan-061", "text": "A monthly Q&A would be amazing. I’d definitely show up.", "createdAt": "2026-10-09T02:08:00Z"}, {"id": "comment-0115", "postId": "post-06", "fanId": "fan-068", "text": "Just caught up on all your posts.", "createdAt": "2026-10-09T02:49:00Z"}, {"id": "comment-0116", "postId": "post-06", "fanId": "fan-075", "text": "These casual conversations make it feel really personal.", "createdAt": "2026-10-09T03:30:00Z"}, {"id": "comment-0117", "postId": "post-06", "fanId": "fan-082", "text": "Honestly one of my favourite photo sets you’ve shared.", "createdAt": "2026-10-09T04:11:00Z"}, {"id": "comment-0118", "postId": "post-06", "fanId": "fan-089", "text": "You should let us choose between two ideas for your next post!", "createdAt": "2026-10-09T04:52:00Z"}, {"id": "comment-0119", "postId": "post-06", "fanId": "fan-096", "text": "More live chats please! Love getting to talk with you directly.", "createdAt": "2026-10-09T05:33:00Z"}, {"id": "comment-0120", "postId": "post-06", "fanId": "fan-007", "text": "Thanks for sharing.", "createdAt": "2026-10-09T06:14:00Z"}, {"id": "comment-0121", "postId": "post-07", "fanId": "fan-079", "text": "The setup and all the little mistakes are the best part for me.", "createdAt": "2026-10-10T04:15:00Z"}, {"id": "comment-0122", "postId": "post-07", "fanId": "fan-086", "text": "Love the warm tones and the way you capture the little details.", "createdAt": "2026-10-10T04:56:00Z"}, {"id": "comment-0123", "postId": "post-07", "fanId": "fan-093", "text": "I was really enjoying this and then it ended! Wish the videos were a bit longer.", "createdAt": "2026-10-10T05:37:00Z"}, {"id": "comment-0124", "postId": "post-07", "fanId": "fan-004", "text": "The wind noise makes the last bit hard to follow.", "createdAt": "2026-10-10T06:18:00Z"}, {"id": "comment-0125", "postId": "post-07", "fanId": "fan-011", "text": "I’d love some more interactive polls on here.", "createdAt": "2026-10-10T06:59:00Z"}, {"id": "comment-0126", "postId": "post-07", "fanId": "fan-018", "text": "See you next time.", "createdAt": "2026-10-10T07:40:00Z"}, {"id": "comment-0127", "postId": "post-07", "fanId": "fan-025", "text": "Your behind the scenes videos always feel so relaxed and real.", "createdAt": "2026-10-10T08:21:00Z"}, {"id": "comment-0128", "postId": "post-07", "fanId": "fan-032", "text": "Every photo feels so thoughtfully put together.", "createdAt": "2026-10-10T09:02:00Z"}, {"id": "comment-0129", "postId": "post-07", "fanId": "fan-039", "text": "Love the content but the clips feel too short lately.", "createdAt": "2026-10-10T09:43:00Z"}, {"id": "comment-0130", "postId": "post-07", "fanId": "fan-046", "text": "A little more consistent volume would be great.", "createdAt": "2026-10-10T10:24:00Z"}, {"id": "comment-0131", "postId": "post-07", "fanId": "fan-053", "text": "Maybe ask us which idea we want to see first?", "createdAt": "2026-10-10T11:05:00Z"}, {"id": "comment-0132", "postId": "post-07", "fanId": "fan-060", "text": "That looks like my old neighbourhood.", "createdAt": "2026-10-10T11:46:00Z"}, {"id": "comment-0133", "postId": "post-07", "fanId": "fan-067", "text": "It’s nice to see what goes into making these. Really enjoy the process.", "createdAt": "2026-10-10T12:27:00Z"}, {"id": "comment-0134", "postId": "post-07", "fanId": "fan-074", "text": "That golden light is everything. Such a beautiful set.", "createdAt": "2026-10-10T13:08:00Z"}, {"id": "comment-0135", "postId": "post-07", "fanId": "fan-081", "text": "Could you make the next one longer? Two minutes goes so fast.", "createdAt": "2026-10-10T13:49:00Z"}, {"id": "comment-0136", "postId": "post-07", "fanId": "fan-088", "text": "I had to turn this all the way up to hear you.", "createdAt": "2026-10-10T14:30:00Z"}, {"id": "comment-0137", "postId": "post-07", "fanId": "fan-095", "text": "It would be so fun to help choose your next adventure.", "createdAt": "2026-10-10T15:11:00Z"}, {"id": "comment-0138", "postId": "post-07", "fanId": "fan-006", "text": "Happy Sunday!", "createdAt": "2026-10-10T15:52:00Z"}, {"id": "comment-0139", "postId": "post-07", "fanId": "fan-013", "text": "These everyday moments are what make your page special to me.", "createdAt": "2026-10-10T16:33:00Z"}, {"id": "comment-0140", "postId": "post-07", "fanId": "fan-020", "text": "Your eye for composition is incredible.", "createdAt": "2026-10-10T17:14:00Z"}, {"id": "comment-0141", "postId": "post-08", "fanId": "fan-092", "text": "A monthly Q&A would be amazing. I’d definitely show up.", "createdAt": "2026-10-11T15:15:00Z"}, {"id": "comment-0142", "postId": "post-08", "fanId": "fan-003", "text": "Would love to help pick the location next time.", "createdAt": "2026-10-11T15:56:00Z"}, {"id": "comment-0143", "postId": "post-08", "fanId": "fan-010", "text": "Your photos have such a distinctive feel. I can always tell it’s you.", "createdAt": "2026-10-11T16:37:00Z"}, {"id": "comment-0144", "postId": "post-08", "fanId": "fan-017", "text": "Just caught up on all your posts.", "createdAt": "2026-10-11T17:18:00Z"}, {"id": "comment-0145", "postId": "post-08", "fanId": "fan-024", "text": "I appreciate you checking in with us. Such a nice community.", "createdAt": "2026-10-11T17:59:00Z"}, {"id": "comment-0146", "postId": "post-08", "fanId": "fan-031", "text": "More live chats please! Love getting to talk with you directly.", "createdAt": "2026-10-11T18:40:00Z"}, {"id": "comment-0147", "postId": "post-08", "fanId": "fan-038", "text": "You should let us choose between two ideas for your next post!", "createdAt": "2026-10-11T19:21:00Z"}, {"id": "comment-0148", "postId": "post-08", "fanId": "fan-045", "text": "Honestly one of my favourite photo sets you’ve shared.", "createdAt": "2026-10-11T20:02:00Z"}, {"id": "comment-0149", "postId": "post-08", "fanId": "fan-052", "text": "Thanks for sharing.", "createdAt": "2026-10-11T20:43:00Z"}, {"id": "comment-0150", "postId": "post-08", "fanId": "fan-059", "text": "These casual conversations make it feel really personal.", "createdAt": "2026-10-11T21:24:00Z"}, {"id": "comment-0151", "postId": "post-08", "fanId": "fan-066", "text": "Could you answer some of our questions in the next video?", "createdAt": "2026-10-11T22:05:00Z"}, {"id": "comment-0152", "postId": "post-08", "fanId": "fan-073", "text": "A poll for what to do next would be really fun.", "createdAt": "2026-10-11T22:46:00Z"}, {"id": "comment-0153", "postId": "post-08", "fanId": "fan-080", "text": "The light in these photos is absolutely beautiful.", "createdAt": "2026-10-11T23:27:00Z"}, {"id": "comment-0154", "postId": "post-08", "fanId": "fan-087", "text": "Anyone else here from the last live?", "createdAt": "2026-10-12T00:08:00Z"}, {"id": "comment-0155", "postId": "post-08", "fanId": "fan-094", "text": "Such a lovely little update. Hope your week is going well.", "createdAt": "2026-10-12T00:49:00Z"}, {"id": "comment-0156", "postId": "post-08", "fanId": "fan-005", "text": "Let us know when you’re doing another live. I have so many questions.", "createdAt": "2026-10-12T01:30:00Z"}, {"id": "comment-0157", "postId": "post-08", "fanId": "fan-012", "text": "Could we have a say in the next photo theme?", "createdAt": "2026-10-12T02:11:00Z"}, {"id": "comment-0158", "postId": "post-08", "fanId": "fan-019", "text": "Your colour choices are always so good. This whole set is gorgeous.", "createdAt": "2026-10-12T02:52:00Z"}, {"id": "comment-0159", "postId": "post-08", "fanId": "fan-026", "text": "Not sure what I think yet.", "createdAt": "2026-10-12T03:33:00Z"}, {"id": "comment-0160", "postId": "post-08", "fanId": "fan-033", "text": "I look forward to the everyday moments as much as the finished work.", "createdAt": "2026-10-12T04:14:00Z"}, {"id": "comment-0161", "postId": "post-09", "fanId": "fan-009", "text": "Happy Sunday!", "createdAt": "2026-10-13T02:15:00Z"}, {"id": "comment-0162", "postId": "post-09", "fanId": "fan-016", "text": "That golden light is everything. Such a beautiful set.", "createdAt": "2026-10-13T02:56:00Z"}, {"id": "comment-0163", "postId": "post-09", "fanId": "fan-023", "text": "Would love to see a day outside the studio, just your normal routine.", "createdAt": "2026-10-13T03:37:00Z"}, {"id": "comment-0164", "postId": "post-09", "fanId": "fan-030", "text": "I really like the quieter posts where you just talk about your day.", "createdAt": "2026-10-13T04:18:00Z"}, {"id": "comment-0165", "postId": "post-09", "fanId": "fan-037", "text": "It would be so fun to help choose your next adventure.", "createdAt": "2026-10-13T04:59:00Z"}, {"id": "comment-0166", "postId": "post-09", "fanId": "fan-044", "text": "Lovely!", "createdAt": "2026-10-13T05:40:00Z"}, {"id": "comment-0167", "postId": "post-09", "fanId": "fan-051", "text": "Your eye for composition is incredible.", "createdAt": "2026-10-13T06:21:00Z"}, {"id": "comment-0168", "postId": "post-09", "fanId": "fan-058", "text": "A little travel series would be amazing.", "createdAt": "2026-10-13T07:02:00Z"}, {"id": "comment-0169", "postId": "post-09", "fanId": "fan-065", "text": "Your updates feel so welcoming. Happy to be here.", "createdAt": "2026-10-13T07:43:00Z"}, {"id": "comment-0170", "postId": "post-09", "fanId": "fan-072", "text": "Can you put the next two ideas to a vote?", "createdAt": "2026-10-13T08:24:00Z"}, {"id": "comment-0171", "postId": "post-09", "fanId": "fan-079", "text": "Hope you have a good week.", "createdAt": "2026-10-13T09:05:00Z"}, {"id": "comment-0172", "postId": "post-09", "fanId": "fan-086", "text": "These colours are so calming. Really love your style.", "createdAt": "2026-10-13T09:46:00Z"}, {"id": "comment-0173", "postId": "post-09", "fanId": "fan-093", "text": "Can we see more of the places you visit?", "createdAt": "2026-10-13T10:27:00Z"}, {"id": "comment-0174", "postId": "post-09", "fanId": "fan-004", "text": "This made my morning better. Thank you for sharing the little things.", "createdAt": "2026-10-13T11:08:00Z"}, {"id": "comment-0175", "postId": "post-09", "fanId": "fan-011", "text": "A community choice post would be amazing.", "createdAt": "2026-10-13T11:49:00Z"}, {"id": "comment-0176", "postId": "post-09", "fanId": "fan-018", "text": "First!", "createdAt": "2026-10-13T12:30:00Z"}, {"id": "comment-0177", "postId": "post-09", "fanId": "fan-025", "text": "The natural light makes the whole thing feel so lovely.", "createdAt": "2026-10-13T13:11:00Z"}, {"id": "comment-0178", "postId": "post-09", "fanId": "fan-032", "text": "Please film the next adventure as a day in your life.", "createdAt": "2026-10-13T13:52:00Z"}, {"id": "comment-0179", "postId": "post-09", "fanId": "fan-039", "text": "Love the relaxed vibe on your page lately.", "createdAt": "2026-10-13T14:33:00Z"}, {"id": "comment-0180", "postId": "post-09", "fanId": "fan-046", "text": "I love when we get to be part of the creative process. More polls please.", "createdAt": "2026-10-13T15:14:00Z"}, {"id": "comment-0181", "postId": "post-10", "fanId": "fan-022", "text": "Anyone else here from the last live?", "createdAt": "2026-10-14T13:15:00Z"}, {"id": "comment-0182", "postId": "post-10", "fanId": "fan-029", "text": "Could you answer some of our questions in the next video?", "createdAt": "2026-10-14T13:56:00Z"}, {"id": "comment-0183", "postId": "post-10", "fanId": "fan-036", "text": "Such a lovely little update. Hope your week is going well.", "createdAt": "2026-10-14T14:37:00Z"}, {"id": "comment-0184", "postId": "post-10", "fanId": "fan-043", "text": "More of this, just with a little extra time please.", "createdAt": "2026-10-14T15:18:00Z"}, {"id": "comment-0185", "postId": "post-10", "fanId": "fan-050", "text": "Please give us a day’s notice for the next one.", "createdAt": "2026-10-14T15:59:00Z"}, {"id": "comment-0186", "postId": "post-10", "fanId": "fan-057", "text": "Would appreciate clearer audio for the outdoor clips.", "createdAt": "2026-10-14T16:40:00Z"}, {"id": "comment-0187", "postId": "post-10", "fanId": "fan-064", "text": "A poll for what to do next would be really fun.", "createdAt": "2026-10-14T17:21:00Z"}, {"id": "comment-0188", "postId": "post-10", "fanId": "fan-071", "text": "Not sure what I think yet.", "createdAt": "2026-10-14T18:02:00Z"}, {"id": "comment-0189", "postId": "post-10", "fanId": "fan-078", "text": "Let us know when you’re doing another live. I have so many questions.", "createdAt": "2026-10-14T18:43:00Z"}, {"id": "comment-0190", "postId": "post-10", "fanId": "fan-085", "text": "I look forward to the everyday moments as much as the finished work.", "createdAt": "2026-10-14T19:24:00Z"}, {"id": "comment-0191", "postId": "post-10", "fanId": "fan-092", "text": "Great idea but the short runtime makes it feel rushed.", "createdAt": "2026-10-14T20:05:00Z"}, {"id": "comment-0192", "postId": "post-10", "fanId": "fan-003", "text": "The short notice makes it difficult with work. Earlier reminders please.", "createdAt": "2026-10-14T20:46:00Z"}, {"id": "comment-0193", "postId": "post-10", "fanId": "fan-010", "text": "Can you turn your voice up a little next time?", "createdAt": "2026-10-14T21:27:00Z"}, {"id": "comment-0194", "postId": "post-10", "fanId": "fan-017", "text": "Could we have a say in the next photo theme?", "createdAt": "2026-10-14T22:08:00Z"}, {"id": "comment-0195", "postId": "post-10", "fanId": "fan-024", "text": "👋", "createdAt": "2026-10-14T22:49:00Z"}, {"id": "comment-0196", "postId": "post-10", "fanId": "fan-031", "text": "The live sessions are great. Any chance of a weekly catch up?", "createdAt": "2026-10-14T23:30:00Z"}, {"id": "comment-0197", "postId": "post-10", "fanId": "fan-038", "text": "The little check ins make this page feel like a community.", "createdAt": "2026-10-15T00:11:00Z"}, {"id": "comment-0198", "postId": "post-10", "fanId": "fan-045", "text": "Would love five or ten minutes of this instead of a quick clip.", "createdAt": "2026-10-15T00:52:00Z"}, {"id": "comment-0199", "postId": "post-10", "fanId": "fan-052", "text": "I keep missing the lives. Can you post the time in advance?", "createdAt": "2026-10-15T01:33:00Z"}, {"id": "comment-0200", "postId": "post-10", "fanId": "fan-059", "text": "Some parts are difficult to hear with the background noise.", "createdAt": "2026-10-15T02:14:00Z"}, {"id": "comment-0201", "postId": "post-11", "fanId": "fan-035", "text": "Can we see more of the places you visit?", "createdAt": "2026-10-16T00:15:00Z"}, {"id": "comment-0202", "postId": "post-11", "fanId": "fan-042", "text": "These colours are so calming. Really love your style.", "createdAt": "2026-10-16T00:56:00Z"}, {"id": "comment-0203", "postId": "post-11", "fanId": "fan-049", "text": "A longer version of this would be so good.", "createdAt": "2026-10-16T01:37:00Z"}, {"id": "comment-0204", "postId": "post-11", "fanId": "fan-056", "text": "Could you check the sound on the outdoor videos?", "createdAt": "2026-10-16T02:18:00Z"}, {"id": "comment-0205", "postId": "post-11", "fanId": "fan-063", "text": "A community choice post would be amazing.", "createdAt": "2026-10-16T02:59:00Z"}, {"id": "comment-0206", "postId": "post-11", "fanId": "fan-070", "text": "Hope you have a good week.", "createdAt": "2026-10-16T03:40:00Z"}, {"id": "comment-0207", "postId": "post-11", "fanId": "fan-077", "text": "Please film the next adventure as a day in your life.", "createdAt": "2026-10-16T04:21:00Z"}, {"id": "comment-0208", "postId": "post-11", "fanId": "fan-084", "text": "The natural light makes the whole thing feel so lovely.", "createdAt": "2026-10-16T05:02:00Z"}, {"id": "comment-0209", "postId": "post-11", "fanId": "fan-091", "text": "I’d prefer fewer videos if they could be a little longer.", "createdAt": "2026-10-16T05:43:00Z"}, {"id": "comment-0210", "postId": "post-11", "fanId": "fan-002", "text": "Enjoyed watching, just wish the talking was a bit clearer.", "createdAt": "2026-10-16T06:24:00Z"}, {"id": "comment-0211", "postId": "post-11", "fanId": "fan-009", "text": "I love when we get to be part of the creative process. More polls please.", "createdAt": "2026-10-16T07:05:00Z"}, {"id": "comment-0212", "postId": "post-11", "fanId": "fan-016", "text": "First!", "createdAt": "2026-10-16T07:46:00Z"}, {"id": "comment-0213", "postId": "post-11", "fanId": "fan-023", "text": "I’d love a photo diary from your next holiday.", "createdAt": "2026-10-16T08:27:00Z"}, {"id": "comment-0214", "postId": "post-11", "fanId": "fan-030", "text": "The little details in the background are gorgeous too.", "createdAt": "2026-10-16T09:08:00Z"}, {"id": "comment-0215", "postId": "post-11", "fanId": "fan-037", "text": "This was lovely but I was expecting a few more minutes.", "createdAt": "2026-10-16T09:49:00Z"}, {"id": "comment-0216", "postId": "post-11", "fanId": "fan-044", "text": "Could barely hear the last part with the wind. Maybe a mic would help?", "createdAt": "2026-10-16T10:30:00Z"}, {"id": "comment-0217", "postId": "post-11", "fanId": "fan-051", "text": "Can we vote on the theme for the next shoot?", "createdAt": "2026-10-16T11:11:00Z"}, {"id": "comment-0218", "postId": "post-11", "fanId": "fan-058", "text": "What song is this?", "createdAt": "2026-10-16T11:52:00Z"}, {"id": "comment-0219", "postId": "post-11", "fanId": "fan-065", "text": "More videos of your daily routine would be really interesting.", "createdAt": "2026-10-16T12:33:00Z"}, {"id": "comment-0220", "postId": "post-11", "fanId": "fan-072", "text": "Your photos have such a distinctive feel. I can always tell it’s you.", "createdAt": "2026-10-16T13:14:00Z"}, {"id": "comment-0221", "postId": "post-12", "fanId": "fan-048", "text": "More travel diaries please. I love seeing new places with you.", "createdAt": "2026-10-17T11:15:00Z"}, {"id": "comment-0222", "postId": "post-12", "fanId": "fan-055", "text": "👋", "createdAt": "2026-10-17T11:56:00Z"}, {"id": "comment-0223", "postId": "post-12", "fanId": "fan-062", "text": "The photography on your page just keeps getting better.", "createdAt": "2026-10-17T12:37:00Z"}, {"id": "comment-0224", "postId": "post-12", "fanId": "fan-069", "text": "The little check ins make this page feel like a community.", "createdAt": "2026-10-17T13:18:00Z"}, {"id": "comment-0225", "postId": "post-12", "fanId": "fan-076", "text": "Let your fans vote for the next outfit or backdrop.", "createdAt": "2026-10-17T13:59:00Z"}, {"id": "comment-0226", "postId": "post-12", "fanId": "fan-083", "text": "A weekend vlog would be so good.", "createdAt": "2026-10-17T14:40:00Z"}, {"id": "comment-0227", "postId": "post-12", "fanId": "fan-090", "text": "See you next time.", "createdAt": "2026-10-17T15:21:00Z"}, {"id": "comment-0228", "postId": "post-12", "fanId": "fan-001", "text": "Love the warm tones and the way you capture the little details.", "createdAt": "2026-10-17T16:02:00Z"}, {"id": "comment-0229", "postId": "post-12", "fanId": "fan-008", "text": "These little life updates always brighten my day.", "createdAt": "2026-10-17T16:43:00Z"}, {"id": "comment-0230", "postId": "post-12", "fanId": "fan-015", "text": "I’d love some more interactive polls on here.", "createdAt": "2026-10-17T17:24:00Z"}, {"id": "comment-0231", "postId": "post-12", "fanId": "fan-022", "text": "Please do a longer city walk video sometime.", "createdAt": "2026-10-17T18:05:00Z"}, {"id": "comment-0232", "postId": "post-12", "fanId": "fan-029", "text": "That looks like my old neighbourhood.", "createdAt": "2026-10-17T18:46:00Z"}, {"id": "comment-0233", "postId": "post-12", "fanId": "fan-036", "text": "Every photo feels so thoughtfully put together.", "createdAt": "2026-10-17T19:27:00Z"}, {"id": "comment-0234", "postId": "post-12", "fanId": "fan-043", "text": "The coffee catch ups are my favourite part of the week.", "createdAt": "2026-10-17T20:08:00Z"}, {"id": "comment-0235", "postId": "post-12", "fanId": "fan-050", "text": "Maybe ask us which idea we want to see first?", "createdAt": "2026-10-17T20:49:00Z"}, {"id": "comment-0236", "postId": "post-12", "fanId": "fan-057", "text": "Would love to see a day outside the studio, just your normal routine.", "createdAt": "2026-10-17T21:30:00Z"}, {"id": "comment-0237", "postId": "post-12", "fanId": "fan-064", "text": "Happy Sunday!", "createdAt": "2026-10-17T22:11:00Z"}, {"id": "comment-0238", "postId": "post-12", "fanId": "fan-071", "text": "That golden light is everything. Such a beautiful set.", "createdAt": "2026-10-17T22:52:00Z"}, {"id": "comment-0239", "postId": "post-12", "fanId": "fan-078", "text": "I really like the quieter posts where you just talk about your day.", "createdAt": "2026-10-17T23:33:00Z"}, {"id": "comment-0240", "postId": "post-12", "fanId": "fan-085", "text": "It would be so fun to help choose your next adventure.", "createdAt": "2026-10-18T00:14:00Z"}, {"id": "comment-0241", "postId": "post-13", "fanId": "fan-061", "text": "The everyday posts are just as good as the big shoots to me.", "createdAt": "2026-10-18T22:15:00Z"}, {"id": "comment-0242", "postId": "post-13", "fanId": "fan-068", "text": "The little details in the background are gorgeous too.", "createdAt": "2026-10-18T22:56:00Z"}, {"id": "comment-0243", "postId": "post-13", "fanId": "fan-075", "text": "This was lovely but I was expecting a few more minutes.", "createdAt": "2026-10-18T23:37:00Z"}, {"id": "comment-0244", "postId": "post-13", "fanId": "fan-082", "text": "Could barely hear the last part with the wind. Maybe a mic would help?", "createdAt": "2026-10-19T00:18:00Z"}, {"id": "comment-0245", "postId": "post-13", "fanId": "fan-089", "text": "Can we vote on the theme for the next shoot?", "createdAt": "2026-10-19T00:59:00Z"}, {"id": "comment-0246", "postId": "post-13", "fanId": "fan-096", "text": "What song is this?", "createdAt": "2026-10-19T01:40:00Z"}, {"id": "comment-0247", "postId": "post-13", "fanId": "fan-007", "text": "The behind the scenes bits are honestly my favourite. Love seeing how you put everything together.", "createdAt": "2026-10-19T02:21:00Z"}, {"id": "comment-0248", "postId": "post-13", "fanId": "fan-014", "text": "I appreciate you checking in with us. Such a nice community.", "createdAt": "2026-10-19T03:02:00Z"}, {"id": "comment-0249", "postId": "post-13", "fanId": "fan-021", "text": "Your photos have such a distinctive feel. I can always tell it’s you.", "createdAt": "2026-10-19T03:43:00Z"}, {"id": "comment-0250", "postId": "post-13", "fanId": "fan-028", "text": "Please give us an extended cut. It ends too quickly!", "createdAt": "2026-10-19T04:24:00Z"}, {"id": "comment-0251", "postId": "post-13", "fanId": "fan-035", "text": "Love this but the background music is louder than your voice.", "createdAt": "2026-10-19T05:05:00Z"}, {"id": "comment-0252", "postId": "post-13", "fanId": "fan-042", "text": "Would love to help pick the location next time.", "createdAt": "2026-10-19T05:46:00Z"}, {"id": "comment-0253", "postId": "post-13", "fanId": "fan-049", "text": "Just caught up on all your posts.", "createdAt": "2026-10-19T06:27:00Z"}, {"id": "comment-0254", "postId": "post-13", "fanId": "fan-056", "text": "This is why I follow you. The unfiltered little moments feel so much more personal.", "createdAt": "2026-10-19T07:08:00Z"}, {"id": "comment-0255", "postId": "post-13", "fanId": "fan-063", "text": "These casual conversations make it feel really personal.", "createdAt": "2026-10-19T07:49:00Z"}, {"id": "comment-0256", "postId": "post-13", "fanId": "fan-070", "text": "Honestly one of my favourite photo sets you’ve shared.", "createdAt": "2026-10-19T08:30:00Z"}, {"id": "comment-0257", "postId": "post-13", "fanId": "fan-077", "text": "I feel like the videos used to be longer. Miss that.", "createdAt": "2026-10-19T09:11:00Z"}, {"id": "comment-0258", "postId": "post-13", "fanId": "fan-084", "text": "The sound is a little quiet on my phone.", "createdAt": "2026-10-19T09:52:00Z"}, {"id": "comment-0259", "postId": "post-13", "fanId": "fan-091", "text": "You should let us choose between two ideas for your next post!", "createdAt": "2026-10-19T10:33:00Z"}, {"id": "comment-0260", "postId": "post-13", "fanId": "fan-002", "text": "Thanks for sharing.", "createdAt": "2026-10-19T11:14:00Z"}, {"id": "comment-0261", "postId": "post-14", "fanId": "fan-074", "text": "That looks like my old neighbourhood.", "createdAt": "2026-10-20T09:15:00Z"}, {"id": "comment-0262", "postId": "post-14", "fanId": "fan-081", "text": "The coffee catch ups are my favourite part of the week.", "createdAt": "2026-10-20T09:56:00Z"}, {"id": "comment-0263", "postId": "post-14", "fanId": "fan-088", "text": "Please open a question box before the next session!", "createdAt": "2026-10-20T10:37:00Z"}, {"id": "comment-0264", "postId": "post-14", "fanId": "fan-095", "text": "Maybe ask us which idea we want to see first?", "createdAt": "2026-10-20T11:18:00Z"}, {"id": "comment-0265", "postId": "post-14", "fanId": "fan-006", "text": "Every photo feels so thoughtfully put together.", "createdAt": "2026-10-20T11:59:00Z"}, {"id": "comment-0266", "postId": "post-14", "fanId": "fan-013", "text": "Happy Sunday!", "createdAt": "2026-10-20T12:40:00Z"}, {"id": "comment-0267", "postId": "post-14", "fanId": "fan-020", "text": "I really like the quieter posts where you just talk about your day.", "createdAt": "2026-10-20T13:21:00Z"}, {"id": "comment-0268", "postId": "post-14", "fanId": "fan-027", "text": "I’d love another ask me anything. The last one was brilliant.", "createdAt": "2026-10-20T14:02:00Z"}, {"id": "comment-0269", "postId": "post-14", "fanId": "fan-034", "text": "It would be so fun to help choose your next adventure.", "createdAt": "2026-10-20T14:43:00Z"}, {"id": "comment-0270", "postId": "post-14", "fanId": "fan-041", "text": "That golden light is everything. Such a beautiful set.", "createdAt": "2026-10-20T15:24:00Z"}, {"id": "comment-0271", "postId": "post-14", "fanId": "fan-048", "text": "Lovely!", "createdAt": "2026-10-20T16:05:00Z"}, {"id": "comment-0272", "postId": "post-14", "fanId": "fan-055", "text": "Your updates feel so welcoming. Happy to be here.", "createdAt": "2026-10-20T16:46:00Z"}, {"id": "comment-0273", "postId": "post-14", "fanId": "fan-062", "text": "Can we do another live Q&A soon? I missed the last one!", "createdAt": "2026-10-20T17:27:00Z"}, {"id": "comment-0274", "postId": "post-14", "fanId": "fan-069", "text": "Can you put the next two ideas to a vote?", "createdAt": "2026-10-20T18:08:00Z"}, {"id": "comment-0275", "postId": "post-14", "fanId": "fan-076", "text": "Your eye for composition is incredible.", "createdAt": "2026-10-20T18:49:00Z"}, {"id": "comment-0276", "postId": "post-14", "fanId": "fan-083", "text": "Hope you have a good week.", "createdAt": "2026-10-20T19:30:00Z"}, {"id": "comment-0277", "postId": "post-14", "fanId": "fan-090", "text": "This made my morning better. Thank you for sharing the little things.", "createdAt": "2026-10-20T20:11:00Z"}, {"id": "comment-0278", "postId": "post-14", "fanId": "fan-001", "text": "Would love a regular live where we can just ask you things.", "createdAt": "2026-10-20T20:52:00Z"}, {"id": "comment-0279", "postId": "post-14", "fanId": "fan-008", "text": "A community choice post would be amazing.", "createdAt": "2026-10-20T21:33:00Z"}, {"id": "comment-0280", "postId": "post-14", "fanId": "fan-015", "text": "These colours are so calming. Really love your style.", "createdAt": "2026-10-20T22:14:00Z"}, {"id": "comment-0281", "postId": "post-15", "fanId": "fan-087", "text": "Take us with you next time! Would love a relaxed vlog.", "createdAt": "2026-10-21T20:15:00Z"}, {"id": "comment-0282", "postId": "post-15", "fanId": "fan-094", "text": "You should let us choose between two ideas for your next post!", "createdAt": "2026-10-21T20:56:00Z"}, {"id": "comment-0283", "postId": "post-15", "fanId": "fan-005", "text": "Thanks for sharing.", "createdAt": "2026-10-21T21:37:00Z"}, {"id": "comment-0284", "postId": "post-15", "fanId": "fan-012", "text": "Honestly one of my favourite photo sets you’ve shared.", "createdAt": "2026-10-21T22:18:00Z"}, {"id": "comment-0285", "postId": "post-15", "fanId": "fan-019", "text": "These casual conversations make it feel really personal.", "createdAt": "2026-10-21T22:59:00Z"}, {"id": "comment-0286", "postId": "post-15", "fanId": "fan-026", "text": "Would love a full day in the life video!", "createdAt": "2026-10-21T23:40:00Z"}, {"id": "comment-0287", "postId": "post-15", "fanId": "fan-033", "text": "A poll for what to do next would be really fun.", "createdAt": "2026-10-22T00:21:00Z"}, {"id": "comment-0288", "postId": "post-15", "fanId": "fan-040", "text": "Anyone else here from the last live?", "createdAt": "2026-10-22T01:02:00Z"}, {"id": "comment-0289", "postId": "post-15", "fanId": "fan-047", "text": "The light in these photos is absolutely beautiful.", "createdAt": "2026-10-22T01:43:00Z"}, {"id": "comment-0290", "postId": "post-15", "fanId": "fan-054", "text": "Such a lovely little update. Hope your week is going well.", "createdAt": "2026-10-22T02:24:00Z"}, {"id": "comment-0291", "postId": "post-15", "fanId": "fan-061", "text": "Can you take us along on your next trip?", "createdAt": "2026-10-22T03:05:00Z"}, {"id": "comment-0292", "postId": "post-15", "fanId": "fan-068", "text": "Could we have a say in the next photo theme?", "createdAt": "2026-10-22T03:46:00Z"}, {"id": "comment-0293", "postId": "post-15", "fanId": "fan-075", "text": "Not sure what I think yet.", "createdAt": "2026-10-22T04:27:00Z"}, {"id": "comment-0294", "postId": "post-15", "fanId": "fan-082", "text": "Your colour choices are always so good. This whole set is gorgeous.", "createdAt": "2026-10-22T05:08:00Z"}, {"id": "comment-0295", "postId": "post-15", "fanId": "fan-089", "text": "I look forward to the everyday moments as much as the finished work.", "createdAt": "2026-10-22T05:49:00Z"}, {"id": "comment-0296", "postId": "post-15", "fanId": "fan-096", "text": "More travel diaries please. I love seeing new places with you.", "createdAt": "2026-10-22T06:30:00Z"}, {"id": "comment-0297", "postId": "post-15", "fanId": "fan-007", "text": "Let your fans vote for the next outfit or backdrop.", "createdAt": "2026-10-22T07:11:00Z"}, {"id": "comment-0298", "postId": "post-15", "fanId": "fan-014", "text": "👋", "createdAt": "2026-10-22T07:52:00Z"}, {"id": "comment-0299", "postId": "post-15", "fanId": "fan-021", "text": "The photography on your page just keeps getting better.", "createdAt": "2026-10-22T08:33:00Z"}, {"id": "comment-0300", "postId": "post-15", "fanId": "fan-028", "text": "The little check ins make this page feel like a community.", "createdAt": "2026-10-22T09:14:00Z"}, {"id": "comment-0301", "postId": "post-16", "fanId": "fan-004", "text": "Music was lovely but I struggled to hear what you were saying.", "createdAt": "2026-10-23T07:15:00Z"}, {"id": "comment-0302", "postId": "post-16", "fanId": "fan-011", "text": "Can you put the next two ideas to a vote?", "createdAt": "2026-10-23T07:56:00Z"}, {"id": "comment-0303", "postId": "post-16", "fanId": "fan-018", "text": "Lovely!", "createdAt": "2026-10-23T08:37:00Z"}, {"id": "comment-0304", "postId": "post-16", "fanId": "fan-025", "text": "Can we do another live Q&A soon? I missed the last one!", "createdAt": "2026-10-23T09:18:00Z"}, {"id": "comment-0305", "postId": "post-16", "fanId": "fan-032", "text": "I missed this again! A bit more warning before you go live would help.", "createdAt": "2026-10-23T09:59:00Z"}, {"id": "comment-0306", "postId": "post-16", "fanId": "fan-039", "text": "Your updates feel so welcoming. Happy to be here.", "createdAt": "2026-10-23T10:40:00Z"}, {"id": "comment-0307", "postId": "post-16", "fanId": "fan-046", "text": "Could you check the sound on the outdoor videos?", "createdAt": "2026-10-23T11:21:00Z"}, {"id": "comment-0308", "postId": "post-16", "fanId": "fan-053", "text": "A community choice post would be amazing.", "createdAt": "2026-10-23T12:02:00Z"}, {"id": "comment-0309", "postId": "post-16", "fanId": "fan-060", "text": "Hope you have a good week.", "createdAt": "2026-10-23T12:43:00Z"}, {"id": "comment-0310", "postId": "post-16", "fanId": "fan-067", "text": "Would love a regular live where we can just ask you things.", "createdAt": "2026-10-23T13:24:00Z"}, {"id": "comment-0311", "postId": "post-16", "fanId": "fan-074", "text": "Could you announce lives the day before? I never catch them in time.", "createdAt": "2026-10-23T14:05:00Z"}, {"id": "comment-0312", "postId": "post-16", "fanId": "fan-081", "text": "This made my morning better. Thank you for sharing the little things.", "createdAt": "2026-10-23T14:46:00Z"}, {"id": "comment-0313", "postId": "post-16", "fanId": "fan-088", "text": "Enjoyed watching, just wish the talking was a bit clearer.", "createdAt": "2026-10-23T15:27:00Z"}, {"id": "comment-0314", "postId": "post-16", "fanId": "fan-095", "text": "I love when we get to be part of the creative process. More polls please.", "createdAt": "2026-10-23T16:08:00Z"}, {"id": "comment-0315", "postId": "post-16", "fanId": "fan-006", "text": "First!", "createdAt": "2026-10-23T16:49:00Z"}, {"id": "comment-0316", "postId": "post-16", "fanId": "fan-013", "text": "Please do more of the question sessions. They are so fun.", "createdAt": "2026-10-23T17:30:00Z"}, {"id": "comment-0317", "postId": "post-16", "fanId": "fan-020", "text": "Please include the time zone when you post live times.", "createdAt": "2026-10-23T18:11:00Z"}, {"id": "comment-0318", "postId": "post-16", "fanId": "fan-027", "text": "Love the relaxed vibe on your page lately.", "createdAt": "2026-10-23T18:52:00Z"}, {"id": "comment-0319", "postId": "post-16", "fanId": "fan-034", "text": "Could barely hear the last part with the wind. Maybe a mic would help?", "createdAt": "2026-10-23T19:33:00Z"}, {"id": "comment-0320", "postId": "post-16", "fanId": "fan-041", "text": "Can we vote on the theme for the next shoot?", "createdAt": "2026-10-23T20:14:00Z"}, {"id": "comment-0321", "postId": "post-17", "fanId": "fan-017", "text": "Can you take us along on your next trip?", "createdAt": "2026-10-24T18:15:00Z"}, {"id": "comment-0322", "postId": "post-17", "fanId": "fan-024", "text": "Your colour choices are always so good. This whole set is gorgeous.", "createdAt": "2026-10-24T18:56:00Z"}, {"id": "comment-0323", "postId": "post-17", "fanId": "fan-031", "text": "Great idea but the short runtime makes it feel rushed.", "createdAt": "2026-10-24T19:37:00Z"}, {"id": "comment-0324", "postId": "post-17", "fanId": "fan-038", "text": "Can you turn your voice up a little next time?", "createdAt": "2026-10-24T20:18:00Z"}, {"id": "comment-0325", "postId": "post-17", "fanId": "fan-045", "text": "Could we have a say in the next photo theme?", "createdAt": "2026-10-24T20:59:00Z"}, {"id": "comment-0326", "postId": "post-17", "fanId": "fan-052", "text": "Not sure what I think yet.", "createdAt": "2026-10-24T21:40:00Z"}, {"id": "comment-0327", "postId": "post-17", "fanId": "fan-059", "text": "More travel diaries please. I love seeing new places with you.", "createdAt": "2026-10-24T22:21:00Z"}, {"id": "comment-0328", "postId": "post-17", "fanId": "fan-066", "text": "The photography on your page just keeps getting better.", "createdAt": "2026-10-24T23:02:00Z"}, {"id": "comment-0329", "postId": "post-17", "fanId": "fan-073", "text": "Would love five or ten minutes of this instead of a quick clip.", "createdAt": "2026-10-24T23:43:00Z"}, {"id": "comment-0330", "postId": "post-17", "fanId": "fan-080", "text": "Some parts are difficult to hear with the background noise.", "createdAt": "2026-10-25T00:24:00Z"}, {"id": "comment-0331", "postId": "post-17", "fanId": "fan-087", "text": "Let your fans vote for the next outfit or backdrop.", "createdAt": "2026-10-25T01:05:00Z"}, {"id": "comment-0332", "postId": "post-17", "fanId": "fan-094", "text": "👋", "createdAt": "2026-10-25T01:46:00Z"}, {"id": "comment-0333", "postId": "post-17", "fanId": "fan-005", "text": "A weekend vlog would be so good.", "createdAt": "2026-10-25T02:27:00Z"}, {"id": "comment-0334", "postId": "post-17", "fanId": "fan-012", "text": "Love the warm tones and the way you capture the little details.", "createdAt": "2026-10-25T03:08:00Z"}, {"id": "comment-0335", "postId": "post-17", "fanId": "fan-019", "text": "I was really enjoying this and then it ended! Wish the videos were a bit longer.", "createdAt": "2026-10-25T03:49:00Z"}, {"id": "comment-0336", "postId": "post-17", "fanId": "fan-026", "text": "The wind noise makes the last bit hard to follow.", "createdAt": "2026-10-25T04:30:00Z"}, {"id": "comment-0337", "postId": "post-17", "fanId": "fan-033", "text": "I’d love some more interactive polls on here.", "createdAt": "2026-10-25T05:11:00Z"}, {"id": "comment-0338", "postId": "post-17", "fanId": "fan-040", "text": "See you next time.", "createdAt": "2026-10-25T05:52:00Z"}, {"id": "comment-0339", "postId": "post-17", "fanId": "fan-047", "text": "Please do a longer city walk video sometime.", "createdAt": "2026-10-25T06:33:00Z"}, {"id": "comment-0340", "postId": "post-17", "fanId": "fan-054", "text": "Every photo feels so thoughtfully put together.", "createdAt": "2026-10-25T07:14:00Z"}, {"id": "comment-0341", "postId": "post-18", "fanId": "fan-030", "text": "The natural light makes the whole thing feel so lovely.", "createdAt": "2026-10-26T05:15:00Z"}, {"id": "comment-0342", "postId": "post-18", "fanId": "fan-037", "text": "Please film the next adventure as a day in your life.", "createdAt": "2026-10-26T05:56:00Z"}, {"id": "comment-0343", "postId": "post-18", "fanId": "fan-044", "text": "I love when we get to be part of the creative process. More polls please.", "createdAt": "2026-10-26T06:37:00Z"}, {"id": "comment-0344", "postId": "post-18", "fanId": "fan-051", "text": "First!", "createdAt": "2026-10-26T07:18:00Z"}, {"id": "comment-0345", "postId": "post-18", "fanId": "fan-058", "text": "Love the relaxed vibe on your page lately.", "createdAt": "2026-10-26T07:59:00Z"}, {"id": "comment-0346", "postId": "post-18", "fanId": "fan-065", "text": "The little details in the background are gorgeous too.", "createdAt": "2026-10-26T08:40:00Z"}, {"id": "comment-0347", "postId": "post-18", "fanId": "fan-072", "text": "I’d love a photo diary from your next holiday.", "createdAt": "2026-10-26T09:21:00Z"}, {"id": "comment-0348", "postId": "post-18", "fanId": "fan-079", "text": "Can we vote on the theme for the next shoot?", "createdAt": "2026-10-26T10:02:00Z"}, {"id": "comment-0349", "postId": "post-18", "fanId": "fan-086", "text": "What song is this?", "createdAt": "2026-10-26T10:43:00Z"}, {"id": "comment-0350", "postId": "post-18", "fanId": "fan-093", "text": "The everyday posts are just as good as the big shoots to me.", "createdAt": "2026-10-26T11:24:00Z"}, {"id": "comment-0351", "postId": "post-18", "fanId": "fan-004", "text": "Your photos have such a distinctive feel. I can always tell it’s you.", "createdAt": "2026-10-26T12:05:00Z"}, {"id": "comment-0352", "postId": "post-18", "fanId": "fan-011", "text": "More videos of your daily routine would be really interesting.", "createdAt": "2026-10-26T12:46:00Z"}, {"id": "comment-0353", "postId": "post-18", "fanId": "fan-018", "text": "Would love to help pick the location next time.", "createdAt": "2026-10-26T13:27:00Z"}, {"id": "comment-0354", "postId": "post-18", "fanId": "fan-025", "text": "Just caught up on all your posts.", "createdAt": "2026-10-26T14:08:00Z"}, {"id": "comment-0355", "postId": "post-18", "fanId": "fan-032", "text": "I appreciate you checking in with us. Such a nice community.", "createdAt": "2026-10-26T14:49:00Z"}, {"id": "comment-0356", "postId": "post-18", "fanId": "fan-039", "text": "Honestly one of my favourite photo sets you’ve shared.", "createdAt": "2026-10-26T15:30:00Z"}, {"id": "comment-0357", "postId": "post-18", "fanId": "fan-046", "text": "Take us with you next time! Would love a relaxed vlog.", "createdAt": "2026-10-26T16:11:00Z"}, {"id": "comment-0358", "postId": "post-18", "fanId": "fan-053", "text": "You should let us choose between two ideas for your next post!", "createdAt": "2026-10-26T16:52:00Z"}, {"id": "comment-0359", "postId": "post-18", "fanId": "fan-060", "text": "Thanks for sharing.", "createdAt": "2026-10-26T17:33:00Z"}, {"id": "comment-0360", "postId": "post-18", "fanId": "fan-067", "text": "These casual conversations make it feel really personal.", "createdAt": "2026-10-26T18:14:00Z"}]$seed$::jsonb) as records(id text,"postId" text,"fanId" text,text text,"createdAt" text)
on conflict (creator_id,id) do update set post_id=excluded.post_id, fan_id=excluded.fan_id, text=excluded.text, created_at=excluded.created_at;

insert into public.audience_preview_results (creator_id,insights,analysed_at,model,prompt_version)
values ('00000000-0000-4000-8000-000000000001',$seed$[
  {
    "id": "preview-theme-1",
    "title": "Behind the scenes feels more personal",
    "category": "love",
    "summary": "Fans love the candid moments that show the person behind the polished posts. Your shoot preparation and everyday updates help them feel closer to you.",
    "opportunity": "Keep sharing a few unfiltered moments alongside your finished content.",
    "commentIds": [
      "comment-0001",
      "comment-0009",
      "comment-0017",
      "comment-0121",
      "comment-0127",
      "comment-0133",
      "comment-0139",
      "comment-0247",
      "comment-0254"
    ],
    "postSummaries": [
      {
        "postId": "post-01",
        "summary": "In the comments on this post, fans love the candid moments that show the person behind the polished posts. Your shoot preparation and everyday updates help them feel closer to you.",
        "opportunity": "Keep sharing a few unfiltered moments alongside your finished content."
      },
      {
        "postId": "post-07",
        "summary": "In the comments on this post, fans love the candid moments that show the person behind the polished posts. Your shoot preparation and everyday updates help them feel closer to you.",
        "opportunity": "Keep sharing a few unfiltered moments alongside your finished content."
      },
      {
        "postId": "post-13",
        "summary": "In the comments on this post, fans love the candid moments that show the person behind the polished posts. Your shoot preparation and everyday updates help them feel closer to you.",
        "opportunity": "Keep sharing a few unfiltered moments alongside your finished content."
      }
    ]
  },
  {
    "id": "preview-theme-2",
    "title": "More time together, live",
    "category": "requests",
    "summary": "Your fans are asking for more live Q&As and chances to ask you questions directly. They value the conversation as much as the content.",
    "opportunity": "Try a relaxed monthly live Q&A, with a question box shared a few days before.",
    "commentIds": [
      "comment-0006",
      "comment-0014",
      "comment-0026",
      "comment-0032",
      "comment-0038",
      "comment-0064",
      "comment-0070",
      "comment-0076",
      "comment-0087",
      "comment-0094",
      "comment-0104",
      "comment-0109",
      "comment-0114",
      "comment-0119",
      "comment-0141",
      "comment-0146",
      "comment-0151",
      "comment-0156",
      "comment-0182",
      "comment-0189",
      "comment-0196",
      "comment-0263",
      "comment-0268",
      "comment-0273",
      "comment-0278",
      "comment-0304",
      "comment-0310",
      "comment-0316"
    ],
    "postSummaries": [
      {
        "postId": "post-01",
        "summary": "In the comments on this post, your fans are asking for more live Q&As and chances to ask you questions directly. They value the conversation as much as the content.",
        "opportunity": "Try a relaxed monthly live Q&A, with a question box shared a few days before."
      },
      {
        "postId": "post-02",
        "summary": "In the comments on this post, your fans are asking for more live Q&As and chances to ask you questions directly. They value the conversation as much as the content.",
        "opportunity": "Try a relaxed monthly live Q&A, with a question box shared a few days before."
      },
      {
        "postId": "post-04",
        "summary": "In the comments on this post, your fans are asking for more live Q&As and chances to ask you questions directly. They value the conversation as much as the content.",
        "opportunity": "Try a relaxed monthly live Q&A, with a question box shared a few days before."
      },
      {
        "postId": "post-05",
        "summary": "In the comments on this post, your fans are asking for more live Q&As and chances to ask you questions directly. They value the conversation as much as the content.",
        "opportunity": "Try a relaxed monthly live Q&A, with a question box shared a few days before."
      },
      {
        "postId": "post-06",
        "summary": "In the comments on this post, your fans are asking for more live Q&As and chances to ask you questions directly. They value the conversation as much as the content.",
        "opportunity": "Try a relaxed monthly live Q&A, with a question box shared a few days before."
      },
      {
        "postId": "post-08",
        "summary": "In the comments on this post, your fans are asking for more live Q&As and chances to ask you questions directly. They value the conversation as much as the content.",
        "opportunity": "Try a relaxed monthly live Q&A, with a question box shared a few days before."
      },
      {
        "postId": "post-10",
        "summary": "In the comments on this post, your fans are asking for more live Q&As and chances to ask you questions directly. They value the conversation as much as the content.",
        "opportunity": "Try a relaxed monthly live Q&A, with a question box shared a few days before."
      },
      {
        "postId": "post-14",
        "summary": "In the comments on this post, your fans are asking for more live Q&As and chances to ask you questions directly. They value the conversation as much as the content.",
        "opportunity": "Try a relaxed monthly live Q&A, with a question box shared a few days before."
      },
      {
        "postId": "post-16",
        "summary": "In the comments on this post, your fans are asking for more live Q&As and chances to ask you questions directly. They value the conversation as much as the content.",
        "opportunity": "Try a relaxed monthly live Q&A, with a question box shared a few days before."
      }
    ]
  },
  {
    "id": "preview-theme-3",
    "title": "A little more time in each video",
    "category": "improve",
    "summary": "Some fans feel the videos finish just as they’re getting into them. They would enjoy longer versions of your existing content.",
    "opportunity": "Experiment with an extended cut of one of your upcoming videos.",
    "commentIds": [
      "comment-0004",
      "comment-0012",
      "comment-0020",
      "comment-0085",
      "comment-0092",
      "comment-0099",
      "comment-0123",
      "comment-0129",
      "comment-0135",
      "comment-0184",
      "comment-0191",
      "comment-0198",
      "comment-0203",
      "comment-0209",
      "comment-0215",
      "comment-0243",
      "comment-0250",
      "comment-0257",
      "comment-0323",
      "comment-0329",
      "comment-0335"
    ],
    "postSummaries": [
      {
        "postId": "post-01",
        "summary": "In the comments on this post, some fans feel the videos finish just as they’re getting into them. They would enjoy longer versions of your existing content.",
        "opportunity": "Experiment with an extended cut of one of your upcoming videos."
      },
      {
        "postId": "post-05",
        "summary": "In the comments on this post, some fans feel the videos finish just as they’re getting into them. They would enjoy longer versions of your existing content.",
        "opportunity": "Experiment with an extended cut of one of your upcoming videos."
      },
      {
        "postId": "post-07",
        "summary": "In the comments on this post, some fans feel the videos finish just as they’re getting into them. They would enjoy longer versions of your existing content.",
        "opportunity": "Experiment with an extended cut of one of your upcoming videos."
      },
      {
        "postId": "post-10",
        "summary": "In the comments on this post, some fans feel the videos finish just as they’re getting into them. They would enjoy longer versions of your existing content.",
        "opportunity": "Experiment with an extended cut of one of your upcoming videos."
      },
      {
        "postId": "post-11",
        "summary": "In the comments on this post, some fans feel the videos finish just as they’re getting into them. They would enjoy longer versions of your existing content.",
        "opportunity": "Experiment with an extended cut of one of your upcoming videos."
      },
      {
        "postId": "post-13",
        "summary": "In the comments on this post, some fans feel the videos finish just as they’re getting into them. They would enjoy longer versions of your existing content.",
        "opportunity": "Experiment with an extended cut of one of your upcoming videos."
      },
      {
        "postId": "post-17",
        "summary": "In the comments on this post, some fans feel the videos finish just as they’re getting into them. They would enjoy longer versions of your existing content.",
        "opportunity": "Experiment with an extended cut of one of your upcoming videos."
      }
    ]
  },
  {
    "id": "preview-theme-4",
    "title": "Your eye for the little things",
    "category": "love",
    "summary": "Fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
    "opportunity": "Keep making space for the warm, natural-light photography your fans mention.",
    "commentIds": [
      "comment-0002",
      "comment-0010",
      "comment-0018",
      "comment-0025",
      "comment-0031",
      "comment-0037",
      "comment-0045",
      "comment-0050",
      "comment-0055",
      "comment-0060",
      "comment-0084",
      "comment-0091",
      "comment-0098",
      "comment-0102",
      "comment-0107",
      "comment-0112",
      "comment-0117",
      "comment-0122",
      "comment-0128",
      "comment-0134",
      "comment-0140",
      "comment-0143",
      "comment-0148",
      "comment-0153",
      "comment-0158",
      "comment-0162",
      "comment-0167",
      "comment-0172",
      "comment-0177",
      "comment-0202",
      "comment-0208",
      "comment-0214",
      "comment-0220",
      "comment-0223",
      "comment-0228",
      "comment-0233",
      "comment-0238",
      "comment-0242",
      "comment-0249",
      "comment-0256",
      "comment-0265",
      "comment-0270",
      "comment-0275",
      "comment-0280",
      "comment-0284",
      "comment-0289",
      "comment-0294",
      "comment-0299",
      "comment-0322",
      "comment-0328",
      "comment-0334",
      "comment-0340",
      "comment-0341",
      "comment-0346",
      "comment-0351",
      "comment-0356"
    ],
    "postSummaries": [
      {
        "postId": "post-01",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-02",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-03",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-05",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-06",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-07",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-08",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-09",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-11",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-12",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-13",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-14",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-15",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-17",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      },
      {
        "postId": "post-18",
        "summary": "In the comments on this post, fans appreciate the thoughtful light, colours and small details in your photos. Your visual style is a clear part of what brings them back.",
        "opportunity": "Keep making space for the warm, natural-light photography your fans mention."
      }
    ]
  },
  {
    "id": "preview-theme-5",
    "title": "Let fans help choose",
    "category": "requests",
    "summary": "Fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
    "opportunity": "Share a simple poll with two ideas for your next shoot.",
    "commentIds": [
      "comment-0007",
      "comment-0015",
      "comment-0021",
      "comment-0027",
      "comment-0033",
      "comment-0039",
      "comment-0042",
      "comment-0047",
      "comment-0052",
      "comment-0057",
      "comment-0062",
      "comment-0068",
      "comment-0074",
      "comment-0080",
      "comment-0081",
      "comment-0088",
      "comment-0095",
      "comment-0103",
      "comment-0108",
      "comment-0113",
      "comment-0118",
      "comment-0125",
      "comment-0131",
      "comment-0137",
      "comment-0142",
      "comment-0147",
      "comment-0152",
      "comment-0157",
      "comment-0165",
      "comment-0170",
      "comment-0175",
      "comment-0180",
      "comment-0187",
      "comment-0194",
      "comment-0205",
      "comment-0211",
      "comment-0217",
      "comment-0225",
      "comment-0230",
      "comment-0235",
      "comment-0240",
      "comment-0245",
      "comment-0252",
      "comment-0259",
      "comment-0264",
      "comment-0269",
      "comment-0274",
      "comment-0279",
      "comment-0282",
      "comment-0287",
      "comment-0292",
      "comment-0297",
      "comment-0302",
      "comment-0308",
      "comment-0314",
      "comment-0320",
      "comment-0325",
      "comment-0331",
      "comment-0337",
      "comment-0343",
      "comment-0348",
      "comment-0353",
      "comment-0358"
    ],
    "postSummaries": [
      {
        "postId": "post-01",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-02",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-03",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-04",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-05",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-06",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-07",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-08",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-09",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-10",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-11",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-12",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-13",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-14",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-15",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-16",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-17",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      },
      {
        "postId": "post-18",
        "summary": "In the comments on this post, fans want to feel involved in your creative choices, from choosing your next location to voting on upcoming themes.",
        "opportunity": "Share a simple poll with two ideas for your next shoot."
      }
    ]
  },
  {
    "id": "preview-theme-6",
    "title": "A heads-up before going live",
    "category": "improve",
    "summary": "Some fans miss your live sessions because they hear about them too late. Advance notice would make it easier for them to join.",
    "opportunity": "Announce your next live at least a day ahead, with the time zone included.",
    "commentIds": [
      "comment-0066",
      "comment-0072",
      "comment-0078",
      "comment-0185",
      "comment-0192",
      "comment-0199",
      "comment-0305",
      "comment-0311",
      "comment-0317"
    ],
    "postSummaries": [
      {
        "postId": "post-04",
        "summary": "In the comments on this post, some fans miss your live sessions because they hear about them too late. Advance notice would make it easier for them to join.",
        "opportunity": "Announce your next live at least a day ahead, with the time zone included."
      },
      {
        "postId": "post-10",
        "summary": "In the comments on this post, some fans miss your live sessions because they hear about them too late. Advance notice would make it easier for them to join.",
        "opportunity": "Announce your next live at least a day ahead, with the time zone included."
      },
      {
        "postId": "post-16",
        "summary": "In the comments on this post, some fans miss your live sessions because they hear about them too late. Advance notice would make it easier for them to join.",
        "opportunity": "Announce your next live at least a day ahead, with the time zone included."
      }
    ]
  },
  {
    "id": "preview-theme-7",
    "title": "The everyday updates matter",
    "category": "love",
    "summary": "Fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
    "opportunity": "Continue mixing everyday check-ins into your regular posts.",
    "commentIds": [
      "comment-0003",
      "comment-0011",
      "comment-0019",
      "comment-0024",
      "comment-0030",
      "comment-0036",
      "comment-0041",
      "comment-0046",
      "comment-0051",
      "comment-0056",
      "comment-0065",
      "comment-0071",
      "comment-0077",
      "comment-0101",
      "comment-0106",
      "comment-0111",
      "comment-0116",
      "comment-0145",
      "comment-0150",
      "comment-0155",
      "comment-0160",
      "comment-0164",
      "comment-0169",
      "comment-0174",
      "comment-0179",
      "comment-0183",
      "comment-0190",
      "comment-0197",
      "comment-0224",
      "comment-0229",
      "comment-0234",
      "comment-0239",
      "comment-0241",
      "comment-0248",
      "comment-0255",
      "comment-0262",
      "comment-0267",
      "comment-0272",
      "comment-0277",
      "comment-0285",
      "comment-0290",
      "comment-0295",
      "comment-0300",
      "comment-0306",
      "comment-0312",
      "comment-0318",
      "comment-0345",
      "comment-0350",
      "comment-0355",
      "comment-0360"
    ],
    "postSummaries": [
      {
        "postId": "post-01",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      },
      {
        "postId": "post-02",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      },
      {
        "postId": "post-03",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      },
      {
        "postId": "post-04",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      },
      {
        "postId": "post-06",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      },
      {
        "postId": "post-08",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      },
      {
        "postId": "post-09",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      },
      {
        "postId": "post-10",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      },
      {
        "postId": "post-12",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      },
      {
        "postId": "post-13",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      },
      {
        "postId": "post-14",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      },
      {
        "postId": "post-15",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      },
      {
        "postId": "post-16",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      },
      {
        "postId": "post-18",
        "summary": "In the comments on this post, fans enjoy your quieter daily updates and casual conversations. Small check-ins help the community feel connected between bigger posts.",
        "opportunity": "Continue mixing everyday check-ins into your regular posts."
      }
    ]
  },
  {
    "id": "preview-theme-8",
    "title": "Take us along on your next trip",
    "category": "requests",
    "summary": "Fans want more day-in-the-life videos and travel diaries that let them follow along beyond the studio.",
    "opportunity": "Turn your next day out into a short, relaxed video diary.",
    "commentIds": [
      "comment-0022",
      "comment-0028",
      "comment-0034",
      "comment-0040",
      "comment-0043",
      "comment-0048",
      "comment-0053",
      "comment-0058",
      "comment-0083",
      "comment-0090",
      "comment-0097",
      "comment-0163",
      "comment-0168",
      "comment-0173",
      "comment-0178",
      "comment-0201",
      "comment-0207",
      "comment-0213",
      "comment-0219",
      "comment-0221",
      "comment-0226",
      "comment-0231",
      "comment-0236",
      "comment-0281",
      "comment-0286",
      "comment-0291",
      "comment-0296",
      "comment-0321",
      "comment-0327",
      "comment-0333",
      "comment-0339",
      "comment-0342",
      "comment-0347",
      "comment-0352",
      "comment-0357"
    ],
    "postSummaries": [
      {
        "postId": "post-02",
        "summary": "In the comments on this post, fans want more day-in-the-life videos and travel diaries that let them follow along beyond the studio.",
        "opportunity": "Turn your next day out into a short, relaxed video diary."
      },
      {
        "postId": "post-03",
        "summary": "In the comments on this post, fans want more day-in-the-life videos and travel diaries that let them follow along beyond the studio.",
        "opportunity": "Turn your next day out into a short, relaxed video diary."
      },
      {
        "postId": "post-05",
        "summary": "In the comments on this post, fans want more day-in-the-life videos and travel diaries that let them follow along beyond the studio.",
        "opportunity": "Turn your next day out into a short, relaxed video diary."
      },
      {
        "postId": "post-09",
        "summary": "In the comments on this post, fans want more day-in-the-life videos and travel diaries that let them follow along beyond the studio.",
        "opportunity": "Turn your next day out into a short, relaxed video diary."
      },
      {
        "postId": "post-11",
        "summary": "In the comments on this post, fans want more day-in-the-life videos and travel diaries that let them follow along beyond the studio.",
        "opportunity": "Turn your next day out into a short, relaxed video diary."
      },
      {
        "postId": "post-12",
        "summary": "In the comments on this post, fans want more day-in-the-life videos and travel diaries that let them follow along beyond the studio.",
        "opportunity": "Turn your next day out into a short, relaxed video diary."
      },
      {
        "postId": "post-15",
        "summary": "In the comments on this post, fans want more day-in-the-life videos and travel diaries that let them follow along beyond the studio.",
        "opportunity": "Turn your next day out into a short, relaxed video diary."
      },
      {
        "postId": "post-17",
        "summary": "In the comments on this post, fans want more day-in-the-life videos and travel diaries that let them follow along beyond the studio.",
        "opportunity": "Turn your next day out into a short, relaxed video diary."
      },
      {
        "postId": "post-18",
        "summary": "In the comments on this post, fans want more day-in-the-life videos and travel diaries that let them follow along beyond the studio.",
        "opportunity": "Turn your next day out into a short, relaxed video diary."
      }
    ]
  },
  {
    "id": "preview-theme-9",
    "title": "Clearer sound in your videos",
    "category": "improve",
    "summary": "A few fans struggle to hear parts of your videos, particularly outdoors. More consistent audio would make those moments easier to enjoy.",
    "opportunity": "Try a small microphone outdoors and check voice volume before posting.",
    "commentIds": [
      "comment-0005",
      "comment-0013",
      "comment-0061",
      "comment-0067",
      "comment-0073",
      "comment-0079",
      "comment-0086",
      "comment-0093",
      "comment-0100",
      "comment-0124",
      "comment-0130",
      "comment-0136",
      "comment-0186",
      "comment-0193",
      "comment-0200",
      "comment-0204",
      "comment-0210",
      "comment-0216",
      "comment-0244",
      "comment-0251",
      "comment-0258",
      "comment-0301",
      "comment-0307",
      "comment-0313",
      "comment-0319",
      "comment-0324",
      "comment-0330",
      "comment-0336"
    ],
    "postSummaries": [
      {
        "postId": "post-01",
        "summary": "In the comments on this post, a few fans struggle to hear parts of your videos, particularly outdoors. More consistent audio would make those moments easier to enjoy.",
        "opportunity": "Try a small microphone outdoors and check voice volume before posting."
      },
      {
        "postId": "post-04",
        "summary": "In the comments on this post, a few fans struggle to hear parts of your videos, particularly outdoors. More consistent audio would make those moments easier to enjoy.",
        "opportunity": "Try a small microphone outdoors and check voice volume before posting."
      },
      {
        "postId": "post-05",
        "summary": "In the comments on this post, a few fans struggle to hear parts of your videos, particularly outdoors. More consistent audio would make those moments easier to enjoy.",
        "opportunity": "Try a small microphone outdoors and check voice volume before posting."
      },
      {
        "postId": "post-07",
        "summary": "In the comments on this post, a few fans struggle to hear parts of your videos, particularly outdoors. More consistent audio would make those moments easier to enjoy.",
        "opportunity": "Try a small microphone outdoors and check voice volume before posting."
      },
      {
        "postId": "post-10",
        "summary": "In the comments on this post, a few fans struggle to hear parts of your videos, particularly outdoors. More consistent audio would make those moments easier to enjoy.",
        "opportunity": "Try a small microphone outdoors and check voice volume before posting."
      },
      {
        "postId": "post-11",
        "summary": "In the comments on this post, a few fans struggle to hear parts of your videos, particularly outdoors. More consistent audio would make those moments easier to enjoy.",
        "opportunity": "Try a small microphone outdoors and check voice volume before posting."
      },
      {
        "postId": "post-13",
        "summary": "In the comments on this post, a few fans struggle to hear parts of your videos, particularly outdoors. More consistent audio would make those moments easier to enjoy.",
        "opportunity": "Try a small microphone outdoors and check voice volume before posting."
      },
      {
        "postId": "post-16",
        "summary": "In the comments on this post, a few fans struggle to hear parts of your videos, particularly outdoors. More consistent audio would make those moments easier to enjoy.",
        "opportunity": "Try a small microphone outdoors and check voice volume before posting."
      },
      {
        "postId": "post-17",
        "summary": "In the comments on this post, a few fans struggle to hear parts of your videos, particularly outdoors. More consistent audio would make those moments easier to enjoy.",
        "opportunity": "Try a small microphone outdoors and check voice volume before posting."
      }
    ]
  }
]
$seed$::jsonb,'2026-10-27T08:00:00Z','Editorial design fixture. No AI analysis.','preview-only')
on conflict (creator_id) do update set insights=excluded.insights, analysed_at=excluded.analysed_at, model=excluded.model, prompt_version=excluded.prompt_version;

commit;
