import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTicket1709798834874 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE public.ticket (
                id integer NOT NULL,
                user_id integer NOT NULL,
                user_name character varying,
                user_email character varying,
                textMessage character varying,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,
                primary key (id),
                foreign key (user_id) references public.user(id)
               
            );

            CREATE SEQUENCE public.ticket_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
                
            ALTER SEQUENCE public.ticket_id_seq OWNED BY public.ticket.id;
            
            ALTER TABLE ONLY public.ticket ALTER COLUMN id SET DEFAULT nextval('public.ticket_id_seq'::regclass);
        `);
  }

  public async down(): Promise<void> {
    ``;
  }
}
