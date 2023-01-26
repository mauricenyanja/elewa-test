import { HandlerTools, Logger } from "@iote/cqrs";

import { Message, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

// import { WebhookMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { HttpClient } from "@angular/common/http";
import { NextBlockService } from "../next-block.class";
import { Message } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { ErrorMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";



export class webhookUserService extends NextBlockService {
    // http: any;
    // constructor(private firestore: AngularFirestore, private http: HttpClient) {
    //   super();
    // }

    fetchAndSendData(orgId: string, variableName: string, url: string, retries: number) {
        // Fetch the data from the Firebase collection
        this.firestore
          .collection(`orgs/${orgId}/end-users/response-data`)
          .doc(variableName)
          .valueChanges()
          .subscribe((data) => {
            // Send the data to the specified URL endpoint
            this.http.post(url, data).subscribe(
              (response) => {
                if (response === 200) {
                  return this.getNextBlock()
                }
              },
              (error) => {
                console.log('Error sending data:', error);
                if (retries > 0) {
                  this.fetchAndSendData(orgId, variableName, url, retries - 1);
                }
              }
            );
          });
      }