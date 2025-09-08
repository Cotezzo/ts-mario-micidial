import { AnySelectMenuInteraction, ButtonInteraction, ChatInputCommandInteraction, CommandInteraction, Message, MessageReaction, MessageReactionEventDetails, PartialMessageReaction, PartialUser, StringSelectMenuInteraction, User } from "discord.js";

/** Define metadata object value definition.
 *  Command metadata are mainly used by the "help" command. */
export type CommandMetadata<I, O>  = {
    /** Keywords users can use to invoke the command.
     *  The first element of the array is considered the "real" command name.
     *  Also displayed by the "help" command. */
    aliases: string[];
    /** Command logic description, used by the "help" command. */
    description: string;
    /** Command category description, used by the "help" command. */
    category: "Information" | "Messages" | "Images" | "Internet" | "Music" | "TTS";
    /** Command usage descripton, used by the "help" command. */
    usage?: string;
    /** Flag that indicates if the command is for internal use only (e.g.
     *  button command interactions for dynamic messages, not directly
     *  callable from users with text or slash commands). */
    hidden?: boolean;

    /** Actual command "business logic", with bare minimum inputs: it could be
     *  invoked either by text messages or interactions - trasnformers functions
     *  parse the normalized inputs for the command.
     *  This command may call the callback function when finished. */
    command: (input: I) => O | Promise<O>;

    /** Contains methods for text messages handling to execute command. */
    onMessage?: {
        /** Method used to handle the incoming text message, parse it and return
         *  the correct parameters to be passed to the core command. */
        requestTransformer: (msg: Message, content: string, args: string[]) => I | Promise<I>;
        /** Callback method called after command completion.
         *  The callback will therefore reply to the message, react, etc... */
        responseTransformer: (msg: Message, output: O) => any;
        /** Method used to handle exceptions during the execution of a command
         *  that has been invoked via text message. */
        errorHandler: (msg: Message, e: Error) => any;
    };

    onReaction?: {
        /** Method used to handle the incoming text message, parse it and return
         *  the correct parameters to be passed to the core command. */
        requestTransformer: (i: onMessageReactionAddData) => I | Promise<I>;
        /** Callback method called after command completion.
         *  The callback will therefore reply to the message, react, etc... */
        responseTransformer: (i: onMessageReactionAddData, output: O) => any;
        /** Method used to handle exceptions during the execution of a command
         *  that has been invoked via text message. */
        errorHandler: (i: onMessageReactionAddData, e: Error) => any;
    }

    /** Contains methods for button interactions handling to execute command. */
    onButton?: {
        /** Method used to handle the incoming interaction event and extract the
         *  correct parameters to be passed to the core command. */
        requestTransformer: (interaction: ButtonInteraction) => I | Promise<I>;
        /** Callback method called after command completion.
         *  The callback will therefore reply, defer update, etc... */
        responseTransformer: (interaction: ButtonInteraction, output: O) => any;
        /** Method used to handle exceptions during the execution of a command
         *  that has been invoked via button interaction. */
        errorHandler: (interaction: ButtonInteraction, e: Error) => any;
    };

    /** Contains methods for selectMenu interactions handling to execute command. */
    onSelect?: {
        /** Method used to handle the incoming interaction event and extract the
         *  correct parameters to be passed to the core command. */
        requestTransformer: (interaction: AnySelectMenuInteraction) => I | Promise<I>;
        /** Callback method called after command completion.
         *  The callback will therefore reply, defer update, etc... */
        responseTransformer: (interaction: AnySelectMenuInteraction, output: O) => any;
        /** Method used to handle exceptions during the execution of a command
         *  that has been invoked via button interaction. */
        errorHandler: (interaction: AnySelectMenuInteraction, e: Error) => any;
    };

    /** Contains methods for chatInput interactions handling to execute command. */
    onSlash?: {
        /** Method used to handle the incoming interaction event and extract the
         *  correct parameters to be passed to the core command. */
        requestTransformer: (interaction: ChatInputCommandInteraction) => I | Promise<I>;
        /** Callback method called after command completion.
         *  The callback will therefore reply, defer update, etc... */
        responseTransformer: (interaction: CommandInteraction, output: O) => any;
        /** Method used to handle exceptions during the execution of a command
         *  that has been invoked via button interaction. */
        errorHandler: (interaction: CommandInteraction, e: Error) => any;
    };
}

export type onMessageReactionAddData = { reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, details: MessageReactionEventDetails };