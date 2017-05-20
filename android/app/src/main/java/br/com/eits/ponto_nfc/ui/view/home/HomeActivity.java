package br.com.eits.ponto_nfc.ui.view.home;

import android.support.v7.app.AppCompatActivity;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import org.androidannotations.annotations.AfterViews;
import org.androidannotations.annotations.EActivity;

import br.com.eits.ponto_nfc.R;

@EActivity(R.layout.activity_ponto)
public class HomeActivity extends AppCompatActivity
{
    @AfterViews
    public void onAfterViews()
    {
        FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference myRef = database.getReference("users/1");

        myRef.setValue("Victor");
    }
}
